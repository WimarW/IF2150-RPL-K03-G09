const { performance } = require('perf_hooks');
const path = require('path');

const BACKEND_MODULES = '/home/wimarw/IF2150-RPL-K03-G09/src/backend/node_modules';
const { PrismaClient } = require(path.join(BACKEND_MODULES, '@prisma/client'));
const WebSocket = require(path.join(BACKEND_MODULES, 'ws'));

const BASE_URL = 'http://127.0.0.1:5000';
const DB_URL = 'postgresql://cariuang_user:cariuang_password@localhost:5433/cariuang_db?schema=public';

const prisma = new PrismaClient({
  datasources: { db: { url: DB_URL } },
});

const RUN_TAG = `knf_${Date.now().toString(36)}`;
const createdUserIds = [];
const createdCategoryIds = [];
const createdTicketIds = [];
const createdContractIds = [];
let csUserId = null;

function stats(arr) {
  const sorted = [...arr].sort((a, b) => a - b);
  const sum = sorted.reduce((a, b) => a + b, 0);
  const avg = sum / sorted.length;
  const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
  return {
    n: sorted.length,
    avgMs: Number(avg.toFixed(2)),
    minMs: Number(sorted[0].toFixed(2)),
    maxMs: Number(sorted[sorted.length - 1].toFixed(2)),
    p95Ms: Number(p95.toFixed(2)),
  };
}

async function req(method, urlPath, { token, body, formData } = {}) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  let payload;
  if (formData) {
    payload = formData;
  } else if (body !== undefined) {
    headers['Content-Type'] = 'application/json';
    payload = JSON.stringify(body);
  }
  const t0 = performance.now();
  const res = await fetch(`${BASE_URL}${urlPath}`, { method, headers, body: payload });
  const text = await res.text();
  const elapsedMs = performance.now() - t0;
  let json = null;
  try { json = JSON.parse(text); } catch {}
  return { status: res.status, json, text, elapsedMs };
}

function connectSocketIO(userId) {
  return new Promise((resolve, reject) => {
    const ws = new WebSocket(
      `ws://127.0.0.1:5000/socket.io/?EIO=4&transport=websocket&userId=${encodeURIComponent(userId)}`
    );
    const listeners = new Map();
    let connected = false;

    const timer = setTimeout(() => {
      if (!connected) {
        ws.close();
        reject(new Error(`Socket.IO connect timeout for ${userId}`));
      }
    }, 5000);

    ws.on('message', (raw) => {
      const msg = raw.toString();
      if (msg.startsWith('0')) {
        ws.send(`40${JSON.stringify({ userId })}`);
      } else if (msg === '2') {
        ws.send('3');
      } else if (msg.startsWith('40')) {
        connected = true;
        clearTimeout(timer);
        resolve({
          ws,
          waitFor(eventName, timeoutMs = 4000) {
            return new Promise((res, rej) => {
              const t = setTimeout(() => {
                listeners.delete(eventName);
                rej(new Error(`Timeout waiting for event ${eventName}`));
              }, timeoutMs);
              listeners.set(eventName, (payload, receivedAt) => {
                clearTimeout(t);
                listeners.delete(eventName);
                res({ payload, receivedAt });
              });
            });
          },
          close() {
            try { ws.close(); } catch {}
          },
        });
      } else if (msg.startsWith('42')) {
        const receivedAt = performance.now();
        try {
          const [evt, payload] = JSON.parse(msg.slice(2));
          if (listeners.has(evt)) listeners.get(evt)(payload, receivedAt);
        } catch {}
      }
    });

    ws.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });
}

async function loginUser(email, password, isCs = false) {
  const r = await req('POST', isCs ? '/api/auth/login/cs' : '/api/auth/login', {
    body: { email, password },
  });
  if (r.status !== 200) throw new Error(`Login failed for ${email}: ${r.status} ${r.text}`);
  const data = r.json?.data ?? r.json;
  const token = data?.token ?? r.json?.token;
  const user = data?.pengguna ?? data?.user ?? data;
  const id = user?.idPengguna ?? user?.idLayananPelanggan ?? user?.id;
  return { token, id, user };
}

async function registerCustomer(suffix) {
  const email = `${RUN_TAG}_${suffix}@test.local`;
  const username = `${RUN_TAG}_${suffix}`;
  const r = await req('POST', '/api/auth/register/pelanggan', {
    body: {
      namaPengguna: `Test User ${suffix}`,
      username,
      email,
      password: 'PasswordAman123',
      nomorTelpon: '081234567890',
    },
  });
  if (r.status !== 201) throw new Error(`Register failed (${suffix}): ${r.status} ${r.text}`);
  const id = r.json?.data?.idPengguna;
  createdUserIds.push(id);
  const auth = await loginUser(email, 'PasswordAman123');
  return { id, email, username, token: auth.token, elapsedMs: r.elapsedMs };
}

async function registerProviderWithService(suffix, lat = -6.8920, lng = 107.6110) {
  const base = await registerCustomer(suffix);
  const regSvc = await req('POST', '/api/services/register', {
    token: base.token,
    body: {
      idPemberiJasa: base.id,
      namaToko: `Toko Uji ${suffix}`,
      jenisJasa: 'Servis',
      deskripsiJasa: 'Layanan uji KNF otomatis CariUang untuk verifikasi performa',
      tarif: 85000,
      jamKerja: '08:00-17:00',
      daerahKerja: 'Coblong, Bandung',
      latitude: lat,
      longitude: lng,
    },
  });
  if (regSvc.status !== 201 && regSvc.status !== 200) {
    throw new Error(`Register service failed (${suffix}): ${regSvc.status} ${regSvc.text}`);
  }
  const catId = regSvc.json?.data?.kategori?.idKategoriJasa;
  if (catId) createdCategoryIds.push(catId);
  const auth = await loginUser(base.email, 'PasswordAman123');
  return { ...base, token: auth.token, categoryId: catId, registerSvcElapsedMs: regSvc.elapsedMs };
}

async function main() {
  const results = {};
  try {
    const health = await req('GET', '/health');
    results._env = { health: health.json, nodeVersion: process.version };

    const cs = await loginUser('cs@cariuang.id', 'PasswordAman123', true);
    csUserId = cs.id;
    const ahmad = await loginUser('ahmad@cariuang.id', 'PasswordAman123');

    const custA = await registerCustomer('cA');
    const custB = await registerCustomer('cB');
    const provA = await registerProviderWithService('pA', -6.8920, 107.6110);
    const provAutoCancel = await registerProviderWithService('pAuto', -6.8930, 107.6120);

    // Persiapan awal KNF11 agar autoCancelKontrakWorker (tick 60 dtk) memproses sambil test lain jalan
    const autoCancelStart = performance.now();
    const acContractRes = await req('POST', '/api/kontrak', {
      token: custA.token,
      body: {
        idPemberiJasa: provAutoCancel.id,
        detailPekerjaan: 'Tes Auto-Cancel 30 Menit KNF11',
        persetujuanHarga: 90000,
      },
    });
    const acContractId = acContractRes.json?.data?.idKontrakPekerjaan;
    if (acContractId) createdContractIds.push(acContractId);
    const acBefore = await prisma.kontrakPekerjaan.findUnique({ where: { idKontrakPekerjaan: acContractId } });
    const acProvBefore = await prisma.pemberiJasa.findUnique({ where: { idPemberiJasa: provAutoCancel.id } });
    const expiresDiffMin = acBefore?.expiresAt
      ? Number(((acBefore.expiresAt.getTime() - acBefore.createdAt.getTime()) / 60000).toFixed(2))
      : null;
    await prisma.kontrakPekerjaan.update({
      where: { idKontrakPekerjaan: acContractId },
      data: { expiresAt: new Date(Date.now() - 2 * 60 * 1000) },
    });

    // KNF01: Response time daftar jasa (< 2 detik)
    {
      const times = [];
      let catCount = 0;
      let svcCount = 0;
      for (let i = 0; i < 5; i++) {
        const t0 = performance.now();
        const [r1, r2] = await Promise.all([
          req('GET', '/api/services/categories'),
          req('GET', '/api/services/search'),
        ]);
        times.push(performance.now() - t0);
        catCount = Array.isArray(r1.json?.data) ? r1.json.data.length : 0;
        svcCount = Array.isArray(r2.json?.data) ? r2.json.data.length : 0;
      }
      const s = stats(times);
      results.KNF01 = { ...s, catCount, svcCount, target: '< 2000 ms', pass: s.maxMs < 2000 };
    }

    // KNF02: Ergonomy pengelompokan kategori
    {
      const r = await req('GET', '/api/services/categories');
      const groups = (r.json?.data ?? []).map((c) => c.jenisJasa);
      results.KNF02 = { httpStatus: r.status, totalCategories: groups.length, sampleCategories: groups.slice(0, 6) };
    }

    // KNF03: Response time detail penyedia jasa (< 1 detik)
    {
      const times = [];
      let status = 0;
      let providerName = '';
      for (let i = 0; i < 5; i++) {
        const r = await req('GET', `/api/services/${ahmad.id}`);
        times.push(r.elapsedMs);
        status = r.status;
        providerName = r.json?.data?.namaToko ?? r.json?.data?.pengguna?.namaPengguna ?? '';
      }
      const s = stats(times);
      results.KNF03 = { ...s, httpStatus: status, providerName, target: '< 1000 ms', pass: status === 200 && s.maxMs < 1000 };
    }

    // KNF04: Reliability Optimistic Locking
    {
      const pBefore = await prisma.pemberiJasa.findUnique({ where: { idPemberiJasa: provA.id } });
      const v0 = pBefore.version;
      const [r1, r2] = await Promise.all([
        req('POST', '/api/kontrak', {
          token: custA.token,
          body: { idPemberiJasa: provA.id, detailPekerjaan: 'Pesanan Bersamaan A (KNF04)', persetujuanHarga: 120000, expectedVersion: v0 },
        }),
        req('POST', '/api/kontrak', {
          token: custB.token,
          body: { idPemberiJasa: provA.id, detailPekerjaan: 'Pesanan Bersamaan B (KNF04)', persetujuanHarga: 125000, expectedVersion: v0 },
        }),
      ]);
      const statuses = [r1.status, r2.status].sort((a, b) => a - b);
      const winner = r1.status === 201 ? r1 : r2;
      const loser = r1.status === 201 ? r2 : r1;
      const winnerId = winner.json?.data?.idKontrakPekerjaan;
      if (winnerId) createdContractIds.push(winnerId);

      const pAfter = await prisma.pemberiJasa.findUnique({ where: { idPemberiJasa: provA.id } });
      const activeCount = await prisma.kontrakPekerjaan.count({
        where: { idPemberiJasa: provA.id, statusPekerjaan: { in: ['Menunggu', 'On Progress'] } },
      });

      results.KNF04 = {
        versionBefore: v0,
        versionAfter: pAfter.version,
        providerStatusAfter: pAfter.statusKetersediaan,
        httpStatuses: statuses,
        loserCode: loser.json?.code ?? loser.json?.message,
        activeContractsInDb: activeCount,
        pass: statuses[0] === 201 && statuses[1] === 409 && pAfter.version === v0 + 1 && activeCount === 1,
      };
      if (winnerId) await req('PATCH', `/api/kontrak/${winnerId}/tolak`, { token: provA.token });
    }

    // KNF05: Response time pencarian radius GPS (<= 2 detik)
    {
      const times = [];
      let count = 0;
      let distances = [];
      for (let i = 0; i < 5; i++) {
        const r = await req('GET', '/api/services/search?lat=-6.8915&long=107.6107&sortBy=nearest');
        times.push(r.elapsedMs);
        const list = r.json?.data ?? [];
        count = list.length;
        distances = list.slice(0, 5).map((x) => x.jarakKm);
      }
      const s = stats(times);
      const sortedAsc = distances.every((d, i) => i === 0 || (d ?? Infinity) >= (distances[i - 1] ?? -Infinity));
      results.KNF05 = { ...s, resultCount: count, sampleDistancesKm: distances, sortedAscending: sortedAsc, target: '<= 2000 ms', pass: s.maxMs <= 2000 && sortedAsc };
    }

    // KNF06: Catatan audit GPS (perlu perangkat fisik Android)
    results.KNF06 = {
      testedOnHardware: false,
      codeFinding: 'useCatalogController.ts:462 uses Location.Accuracy.Balanced (~100m), not Location.Accuracy.High (~10m).',
    };

    // KNF07: Availability endpoint registrasi
    {
      const checks = [];
      for (let i = 0; i < 10; i++) checks.push((await req('GET', '/health')).status);
      const regProbe = await req('POST', '/api/auth/register/pelanggan', { body: {} });
      results.KNF07 = {
        healthChecks: `${checks.filter((c) => c === 200).length}/10 HTTP 200`,
        registerEndpointReachable: regProbe.status === 400,
        serverUptimeSec: Number((health.json?.uptime ?? 0).toFixed(2)),
      };
    }

    // KNF08 (Security): Validasi server & pencegahan SQL Injection
    {
      const sqliLogin = await req('POST', '/api/auth/login', { body: { email: "' OR '1'='1", password: "' OR '1'='1" } });
      const sqliRegEmail = await req('POST', '/api/auth/register/pelanggan', {
        body: { namaPengguna: 'Attacker', username: `${RUN_TAG}_sqli1`, email: "evil@test.com' OR '1'='1", password: 'PasswordAman123', nomorTelpon: '081234567890' },
      });
      const shortPwd = await req('POST', '/api/auth/register/pelanggan', {
        body: { namaPengguna: 'Short Pwd', username: `${RUN_TAG}_short`, email: `${RUN_TAG}_short@test.local`, password: '123', nomorTelpon: '081234567890' },
      });
      const badPhone = await req('POST', '/api/auth/register/pelanggan', {
        body: { namaPengguna: 'Bad Phone', username: `${RUN_TAG}_phone`, email: `${RUN_TAG}_phone@test.local`, password: 'PasswordAman123', nomorTelpon: '0812; DROP TABLE pengguna;--' },
      });
      const dbUser = await prisma.pengguna.findUnique({ where: { idPengguna: custA.id } });
      const totalUsers = await prisma.pengguna.count();

      results.KNF08_Security = {
        sqliLoginStatus: sqliLogin.status,
        sqliRegEmailStatus: sqliRegEmail.status,
        shortPasswordStatus: shortPwd.status,
        sqliPhoneStatus: badPhone.status,
        passwordHashPrefix: dbUser?.password?.slice(0, 7),
        isBcryptHash: Boolean(dbUser?.password?.startsWith('$2')),
        penggunaTableIntactCount: totalUsers,
        pass: sqliLogin.status === 401 && sqliRegEmail.status === 400 && shortPwd.status === 400 && badPhone.status === 400 && Boolean(dbUser?.password?.startsWith('$2')),
      };
    }

    // KNF08b / KNF09 (Response time): Validasi form <= 2 detik
    {
      const invalidTimes = [];
      const validTimes = [];
      for (let i = 0; i < 5; i++) {
        const rInv = await req('POST', '/api/auth/register/pelanggan', {
          body: { namaPengguna: 'Val Test', username: `${RUN_TAG}_inv_${i}`, email: 'bukan-email', password: '123', nomorTelpon: 'abc' },
        });
        invalidTimes.push(rInv.elapsedMs);

        const rVal = await req('POST', '/api/auth/register/pelanggan', {
          body: { namaPengguna: `Val Valid ${i}`, username: `${RUN_TAG}_val_${i}`, email: `${RUN_TAG}_val_${i}@test.local`, password: 'PasswordAman123', nomorTelpon: '081234567890' },
        });
        validTimes.push(rVal.elapsedMs);
        if (rVal.json?.data?.idPengguna) createdUserIds.push(rVal.json.data.idPengguna);
      }
      const sInv = stats(invalidTimes);
      const sVal = stats(validTimes);
      results.KNF08b_KNF09_ResponseTime = { invalidValidation: sInv, validRegistrationWithBcrypt: sVal, target: '<= 2000 ms', pass: sInv.maxMs <= 2000 && sVal.maxMs <= 2000 };
    }

    // KNF10: Response time pembaruan DB penyedia jasa (< 1 detik)
    {
      const times = [];
      const statuses = [];
      for (let i = 0; i < 5; i++) {
        const r = await req('POST', '/api/services/register', {
          token: provA.token,
          body: {
            idPemberiJasa: provA.id,
            namaToko: `Toko Uji KNF10 Update ${i + 1}`,
            jenisJasa: 'Servis',
            deskripsiJasa: `Pembaruan layanan uji KNF10 iterasi ke-${i + 1}`,
            tarif: 85000 + i * 5000,
            jamKerja: '08:00-18:00',
            daerahKerja: 'Coblong, Bandung',
            latitude: -6.8920,
            longitude: 107.6110,
          },
        });
        times.push(r.elapsedMs);
        statuses.push(r.status);
        if (r.json?.data?.kategori?.idKategoriJasa) createdCategoryIds.push(r.json.data.kategori.idKategoriJasa);
      }
      const pCheck = await prisma.pemberiJasa.findUnique({ where: { idPemberiJasa: provA.id } });
      const s = stats(times);
      results.KNF10 = { ...s, httpStatuses: statuses, dbNamaTokoUpdated: pCheck?.namaToko, target: '< 1000 ms', pass: statuses.every((st) => st === 200 || st === 201) && s.maxMs < 1000 };
    }

    // KNF12: Response time notifikasi pesanan ke penyedia jasa (< 1 detik)
    {
      const sockProv = await connectSocketIO(provA.id);
      const notifLatencies = [];
      const httpLatencies = [];
      for (let i = 0; i < 5; i++) {
        const waitNotif = sockProv.waitFor('notification:new', 4000);
        const t0 = performance.now();
        const r = await req('POST', '/api/kontrak', {
          token: custA.token,
          body: { idPemberiJasa: provA.id, detailPekerjaan: `Pesanan Uji Notifikasi KNF12 #${i + 1}`, persetujuanHarga: 100000 },
        });
        const notifEvt = await waitNotif;
        notifLatencies.push(notifEvt.receivedAt - t0);
        httpLatencies.push(r.elapsedMs);
        const cid = r.json?.data?.idKontrakPekerjaan;
        if (cid) {
          createdContractIds.push(cid);
          await req('PATCH', `/api/kontrak/${cid}/tolak`, { token: provA.token });
        }
      }
      sockProv.close();
      const sNotif = stats(notifLatencies);
      const dbNotifCount = await prisma.notifikasi.count({ where: { idPenerima: provA.id } });
      results.KNF12 = { socketNotifDelivery: sNotif, httpOrderCreate: stats(httpLatencies), dbNotifCountForProvider: dbNotifCount, target: '< 1000 ms', pass: sNotif.maxMs < 1000 && dbNotifCount >= 5 };
    }

    // KNF14 (Security E2EE) + KNF15 (Response time chat <= 1 detik)
    {
      const sockRecv = await connectSocketIO(provA.id);
      const chatLatencies = [];
      const httpLatencies = [];
      const secretMsg = `Rahasia KNF14 E2EE Check (${RUN_TAG})`;

      for (let i = 0; i < 5; i++) {
        const waitChat = sockRecv.waitFor('chat:new', 4000);
        const t0 = performance.now();
        const r = await req('POST', '/api/chats', {
          token: custA.token,
          body: { idPenerima: provA.id, isiPesan: i === 0 ? secretMsg : `Uji latensi pesan #${i + 1}` },
        });
        const chatEvt = await waitChat;
        chatLatencies.push(chatEvt.receivedAt - t0);
        httpLatencies.push(r.elapsedMs);
      }
      sockRecv.close();

      const dbChat = await prisma.komunikasi.findFirst({
        where: { idPengguna: custA.id, idPenerima: provA.id, isiPesan: secretMsg },
      });
      results.KNF14 = {
        sentPlaintext: secretMsg,
        storedInDbIsiPesan: dbChat?.isiPesan,
        exactPlaintextMatch: dbChat?.isiPesan === secretMsg,
        pass: false,
      };
      const sChat = stats(chatLatencies);
      results.KNF15 = { socketChatDelivery: sChat, httpSendChat: stats(httpLatencies), frontendPollingMs: 3000, target: '<= 1000 ms', passBackendRealtime: sChat.maxMs <= 1000 };
    }

    // KNF17 (Form kontrak) + KNF18 (Security form kontrak)
    {
      const formRes = await req('GET', '/api/kontrak/form', { token: custA.token });
      results.KNF17 = { httpStatus: formRes.status, sampleKeys: formRes.json?.data ? Object.keys(formRes.json.data) : [], pass: formRes.status === 200 };

      const xssRes = await req('POST', '/api/kontrak', { token: custA.token, body: { idPemberiJasa: provA.id, detailPekerjaan: '<script>alert("xss")</script>', persetujuanHarga: 50000 } });
      const sqliRes = await req('POST', '/api/kontrak', { token: custA.token, body: { idPemberiJasa: provA.id, detailPekerjaan: 'Servis AC; DROP TABLE kontrak_pekerjaan; --', persetujuanHarga: 50000 } });
      const negPriceRes = await req('POST', '/api/kontrak', { token: custA.token, body: { idPemberiJasa: provA.id, detailPekerjaan: 'Servis AC normal', persetujuanHarga: -50000 } });
      const zeroPriceRes = await req('POST', '/api/kontrak', { token: custA.token, body: { idPemberiJasa: provA.id, detailPekerjaan: 'Servis AC normal', persetujuanHarga: 0 } });
      const emptyDetailRes = await req('POST', '/api/kontrak', { token: custA.token, body: { idPemberiJasa: provA.id, detailPekerjaan: '   ', persetujuanHarga: 50000 } });
      results.KNF18 = {
        xssStatus: xssRes.status, sqliStatus: sqliRes.status, negativePriceStatus: negPriceRes.status,
        zeroPriceStatus: zeroPriceRes.status, emptyDetailStatus: emptyDetailRes.status,
        pass: [xssRes, sqliRes, negPriceRes, zeroPriceRes, emptyDetailRes].every((r) => r.status === 400),
      };
    }

    // KNF19, KNF13, KNF20, KNF21, KNF22, KNF27, KNF28 (Siklus Kontrak + Rating)
    {
      const createRes = await req('POST', '/api/kontrak', {
        token: custA.token,
        body: { idPemberiJasa: provA.id, detailPekerjaan: 'Servis AC 1 PK di Jl. Ganesha No. 10 Bandung', persetujuanHarga: 150000 },
      });
      const cid = createRes.json?.data?.idKontrakPekerjaan;
      if (cid) createdContractIds.push(cid);

      const invalidFromMenunggu = await req('PATCH', `/api/kontrak/${cid}/konfirmasi`, { token: custA.token });
      const ratingBeforeDone = await req('POST', '/api/ratings', {
        token: custA.token,
        body: { idPenggunaPenerima: provA.id, idKontrakPekerjaan: cid, nilaiRating: 5, ulasan: 'Belum selesai' },
      });

      const acceptRes = await req('PATCH', `/api/kontrak/${cid}/terima`, { token: provA.token });
      const provLocked = await prisma.pemberiJasa.findUnique({ where: { idPemberiJasa: provA.id } });
      const contractOnProg = await prisma.kontrakPekerjaan.findUnique({ where: { idKontrakPekerjaan: cid } });
      const bookWhileBusy = await req('POST', '/api/kontrak', {
        token: custB.token,
        body: { idPemberiJasa: provA.id, detailPekerjaan: 'Coba pesan saat On Progress', persetujuanHarga: 100000 },
      });
      results.KNF19 = {
        acceptHttpStatus: acceptRes.status,
        contractStatusInDb: contractOnProg?.statusPekerjaan,
        providerAvailabilityInDb: provLocked?.statusKetersediaan,
        secondBookingBlockedStatus: bookWhileBusy.status,
        pass: acceptRes.status === 200 && contractOnProg?.statusPekerjaan === 'On Progress' && provLocked?.statusKetersediaan === 'On Progress' && bookWhileBusy.status === 409,
      };

      const detailAfterAccept = await req('GET', `/api/kontrak/${cid}`, { token: provA.token });
      const dObj = detailAfterAccept.json?.data ?? {};
      results.KNF13 = {
        httpStatus: detailAfterAccept.status,
        detailPekerjaan: dObj.detailPekerjaan,
        returnedKeys: Object.keys(dObj),
        hasDedicatedCustomerLocationField: Boolean(dObj.lokasi || dObj.alamat || dObj.latitude),
      };

      const sockCust = await connectSocketIO(custA.id);
      const waitFinishNotif = sockCust.waitFor('notification:new', 4000);
      const tFin = performance.now();
      const finishRes = await req('PATCH', `/api/kontrak/${cid}/selesai`, { token: provA.token });
      const finishNotifEvt = await waitFinishNotif;
      sockCust.close();
      const finishNotifDb = await prisma.notifikasi.findFirst({ where: { idPenerima: custA.id }, orderBy: { waktuNotifikasi: 'desc' } });
      results.KNF20 = {
        selesaiHttpStatus: finishRes.status,
        contractStatusAfterSelesai: finishRes.json?.data?.statusPekerjaan,
        socketNotifReceivedMs: Number((finishNotifEvt.receivedAt - tFin).toFixed(2)),
        notifMessageInDb: finishNotifDb?.isiNotifikasi,
        pass: finishRes.status === 200 && Boolean(finishNotifEvt) && Boolean(finishNotifDb),
      };

      const confirmRes = await req('PATCH', `/api/kontrak/${cid}/konfirmasi`, { token: custA.token });
      const contractDone = await prisma.kontrakPekerjaan.findUnique({ where: { idKontrakPekerjaan: cid } });
      const provUnlocked = await prisma.pemberiJasa.findUnique({ where: { idPemberiJasa: provA.id } });
      const invalidFromDone = await req('PATCH', `/api/kontrak/${cid}/konfirmasi`, { token: custA.token });

      results.KNF21 = {
        confirmHttpStatus: confirmRes.status,
        contractStatusInDb: contractDone?.statusPekerjaan,
        providerAvailabilityAfterDone: provUnlocked?.statusKetersediaan,
        pass: confirmRes.status === 200 && contractDone?.statusPekerjaan === 'Done' && provUnlocked?.statusKetersediaan === 'Available',
      };
      results.KNF22 = {
        menungguToDoneStatus: invalidFromMenunggu.status,
        menungguToDoneMsg: invalidFromMenunggu.json?.message,
        validToDoneStatus: confirmRes.status,
        doneToDoneStatus: invalidFromDone.status,
        pass: invalidFromMenunggu.status === 400 && confirmRes.status === 200 && invalidFromDone.status === 400,
      };

      const verifyRatingRes = await req('GET', `/api/ratings/verify/${cid}`, { token: custA.token });
      const rateProvRes = await req('POST', '/api/ratings', {
        token: custA.token,
        body: { idPenggunaPenerima: provA.id, idKontrakPekerjaan: cid, nilaiRating: 5, ulasan: 'Kerja rapi dan cepat' },
      });
      const rateCustRes = await req('POST', '/api/ratings', {
        token: provA.token,
        body: { idPenggunaPenerima: custA.id, idKontrakPekerjaan: cid, nilaiRating: 4, ulasan: 'Pelanggan ramah' },
      });
      const dupRateRes = await req('POST', '/api/ratings', {
        token: custA.token,
        body: { idPenggunaPenerima: provA.id, idKontrakPekerjaan: cid, nilaiRating: 3, ulasan: 'Duplikat' },
      });
      const dbProvRating = await prisma.pengguna.findUnique({ where: { idPengguna: provA.id }, select: { akumulasiRating: true, riwayatRating: true } });
      const dbCustRating = await prisma.pengguna.findUnique({ where: { idPengguna: custA.id }, select: { akumulasiRating: true, riwayatRating: true } });

      results.KNF27 = {
        beforeDoneRejectedStatus: ratingBeforeDone.status,
        verifyEndpointStatus: verifyRatingRes.status,
        customerToProviderStatus: rateProvRes.status,
        providerToCustomerStatus: rateCustRes.status,
        duplicateRejectedStatus: dupRateRes.status,
        pass: ratingBeforeDone.status === 400 && verifyRatingRes.status === 200 && rateProvRes.status === 201 && rateCustRes.status === 201 && dupRateRes.status === 400,
      };
      results.KNF28 = {
        providerDbRating: dbProvRating,
        customerDbRating: dbCustRating,
        pass: dbProvRating?.akumulasiRating === 5 && dbCustRating?.akumulasiRating === 4,
      };
    }

    // KNF23, KNF24, KNF25, KNF26 (Tiket Laporan & Kanal CS)
    {
      const availStatuses = [];
      for (let i = 0; i < 10; i++) availStatuses.push((await req('GET', '/api/tickets/mine', { token: custA.token })).status);
      const csStatsRes = await req('GET', '/api/cs/stats', { token: cs.token });
      results.KNF23 = { ticketsMineChecks: `${availStatuses.filter((s) => s === 200).length}/10 HTTP 200`, csStatsStatus: csStatsRes.status };

      const cols = await prisma.$queryRaw`
        SELECT column_name, data_type FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'tiket_laporan' ORDER BY ordinal_position
      `;
      results.KNF24 = { tableExists: cols.length > 0, columnCount: cols.length, columns: cols.map((c) => `${c.column_name}(${c.data_type})`), pass: cols.length > 0 };

      const sockCs = await connectSocketIO(csUserId);
      const httpTimes = [];
      const notifTimes = [];
      let assignedCount = 0;
      for (let i = 0; i < 5; i++) {
        const waitNotif = sockCs.waitFor('notification:new', 4000);
        const fd = new FormData();
        fd.append('jenisTiket', 'Kendala Aplikasi');
        fd.append('keteranganTiket', `Uji KNF25 #${i + 1} (${RUN_TAG})`);
        const t0 = performance.now();
        const r = await req('POST', '/api/tickets', { token: custA.token, formData: fd });
        const evt = await waitNotif;
        httpTimes.push(r.elapsedMs);
        notifTimes.push(evt.receivedAt - t0);
        const tid = r.json?.data?.tiket?.id;
        if (tid) createdTicketIds.push(tid);
        if (r.json?.data?.tiket?.assignedTo === csUserId) assignedCount++;
        // Tutup tiket 0..3 agar CS tidak menyentuh batas beban 5 tiket (Busy) saat benchmark
        if (i < 4 && tid) await req('POST', `/api/cs/tickets/${tid}/close`, { token: cs.token });
      }
      sockCs.close();
      const sTiketHttp = stats(httpTimes);
      const sTiketNotif = stats(notifTimes);
      results.KNF25 = {
        httpTicketCreate: sTiketHttp,
        csNotifDelivery: sTiketNotif,
        assignedToCsCount: assignedCount,
        createdTickets: createdTicketIds,
        target: '< 1000 ms + CS notification',
        pass: sTiketHttp.maxMs < 1000 && sTiketNotif.maxMs < 1000 && assignedCount === 5,
      };

      const openTid = createdTicketIds[4];
      const uMsg1 = await req('POST', `/api/tickets/${openTid}/messages`, { token: custA.token, body: { text: 'Halo CS, ini pesan pelapor saat tiket terbuka' } });
      const csRep = await req('POST', `/api/cs/tickets/${openTid}/reply`, { token: cs.token, body: { text: 'Halo, laporan sedang kami tangani.' } });
      const tMid = await prisma.tiketLaporan.findUnique({ where: { idTiket: openTid } });
      const msgCount = await prisma.komunikasi.count({ where: { idTiket: openTid } });
      const csCls = await req('POST', `/api/cs/tickets/${openTid}/close`, { token: cs.token });
      const tEnd = await prisma.tiketLaporan.findUnique({ where: { idTiket: openTid } });
      const uMsgAfterClose = await req('POST', `/api/tickets/${openTid}/messages`, { token: custA.token, body: { text: 'Coba kirim lagi setelah ditutup' } });
      results.KNF26 = {
        ticketId: openTid,
        userMessageWhileOpenStatus: uMsg1.status,
        csReplyStatus: csRep.status,
        statusAfterReply: tMid?.statusTiket,
        messagesStoredInChannel: msgCount,
        csCloseStatus: csCls.status,
        statusAfterClose: tEnd?.statusTiket,
        userMessageAfterCloseStatus: uMsgAfterClose.status,
        userMessageAfterCloseMsg: uMsgAfterClose.json?.message,
        pass: uMsg1.status === 201 && csRep.status === 201 && tMid?.statusTiket === 'Diproses' && msgCount === 2 && csCls.status === 200 && tEnd?.statusTiket === 'Selesai' && uMsgAfterClose.status === 409,
      };
    }

    // KNF16: Reliability Load Test 1000 percakapan serentak
    {
      const TOTAL = 1000;
      const tStart = performance.now();
      const latencies = [];
      let ok201 = 0;
      const httpErrors = {};
      let networkErrors = 0;

      await Promise.all(
        Array.from({ length: TOTAL }, (_, idx) =>
          req('POST', '/api/chats', {
            token: custA.token,
            body: { idPenerima: provA.id, isiPesan: `LoadTest KNF16 #${idx + 1} (${RUN_TAG})` },
          })
            .then((r) => {
              latencies.push(r.elapsedMs);
              if (r.status === 201) ok201++;
              else httpErrors[r.status] = (httpErrors[r.status] || 0) + 1;
            })
            .catch(() => { networkErrors++; })
        )
      );
      const totalElapsedMs = Number((performance.now() - tStart).toFixed(2));
      const persistedCount = await prisma.komunikasi.count({
        where: { idPengguna: custA.id, idPenerima: provA.id, isiPesan: { startsWith: 'LoadTest KNF16 #' } },
      });
      results.KNF16 = {
        concurrentRequests: TOTAL,
        success201: ok201,
        persistedInDb: persistedCount,
        httpErrors,
        networkErrors,
        totalDurationMs: totalElapsedMs,
        throughputReqPerSec: Number((ok201 / (totalElapsedMs / 1000)).toFixed(2)),
        latency: latencies.length ? stats(latencies) : null,
        pass: ok201 === TOTAL && persistedCount === TOTAL && networkErrors === 0,
      };
    }

    // KNF11: Verifikasi hasil autoCancelKontrakWorker server aktif (maks tunggu 68 dtk)
    {
      let acAfter = await prisma.kontrakPekerjaan.findUnique({ where: { idKontrakPekerjaan: acContractId } });
      while (acAfter?.statusPekerjaan === 'Menunggu' && performance.now() - autoCancelStart < 68000) {
        await new Promise((r) => setTimeout(r, 2000));
        acAfter = await prisma.kontrakPekerjaan.findUnique({ where: { idKontrakPekerjaan: acContractId } });
      }
      const acProvAfter = await prisma.pemberiJasa.findUnique({ where: { idPemberiJasa: provAutoCancel.id } });
      results.KNF11 = {
        expiresAtOffsetMinutes: expiresDiffMin,
        contractStatusBefore: acBefore?.statusPekerjaan,
        providerStatusBefore: acProvBefore?.statusKetersediaan,
        contractStatusAfterWorker: acAfter?.statusPekerjaan,
        providerStatusAfterWorker: acProvAfter?.statusKetersediaan,
        workerWaitElapsedSec: Number(((performance.now() - autoCancelStart) / 1000).toFixed(2)),
        pass: expiresDiffMin === 30 && acAfter?.statusPekerjaan === 'Dibatalkan' && acProvAfter?.statusKetersediaan === 'Available',
      };
    }

    console.log(JSON.stringify(results, null, 2));
  } finally {
    // Cleanup seluruh data uji sementara & pulihkan beban/status CS
    try {
      if (createdTicketIds.length) {
        await prisma.komunikasi.deleteMany({ where: { idTiket: { in: createdTicketIds } } });
        await prisma.tiketLaporan.deleteMany({ where: { idTiket: { in: createdTicketIds } } });
        await prisma.notifikasi.deleteMany({
          where: { OR: createdTicketIds.map((tid) => ({ isiNotifikasi: { contains: tid } })) },
        });
      }
      if (csUserId) {
        const actualOpen = await prisma.tiketLaporan.count({
          where: { idLayananPelanggan: csUserId, statusTiket: { not: 'Selesai' } },
        });
        await prisma.layananPelanggan.update({
          where: { idLayananPelanggan: csUserId },
          data: { jumlahTiketDipegang: actualOpen, status: actualOpen < 5 ? 'Available' : 'Busy' },
        });
      }
      if (createdUserIds.length) {
        await prisma.rating.deleteMany({
          where: { OR: [{ idPenggunaPemberi: { in: createdUserIds } }, { idPenggunaPenerima: { in: createdUserIds } }] },
        });
        await prisma.komunikasi.deleteMany({
          where: { OR: [{ idPengguna: { in: createdUserIds } }, { idPenerima: { in: createdUserIds } }] },
        });
        await prisma.notifikasi.deleteMany({ where: { idPenerima: { in: createdUserIds } } });
        await prisma.kontrakPekerjaan.deleteMany({
          where: { OR: [{ idPelanggan: { in: createdUserIds } }, { idPemberiJasa: { in: createdUserIds } }] },
        });
        await prisma.pemberiJasa.deleteMany({ where: { idPemberiJasa: { in: createdUserIds } } });
        await prisma.pengguna.deleteMany({ where: { idPengguna: { in: createdUserIds } } });
      }
      if (createdCategoryIds.length) {
        await prisma.kategoriJasa.deleteMany({ where: { idKategoriJasa: { in: createdCategoryIds } } });
      }
    } catch (cleanupErr) {
      console.error('Cleanup warning:', cleanupErr.message);
    }
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});