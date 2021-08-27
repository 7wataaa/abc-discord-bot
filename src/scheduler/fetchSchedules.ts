import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';
import { prisma } from '../prismaClient';
dotenv.config();

//=================================

(async () => {
  await fetchSchedules();
})();

//=================================

type fetchResponse = Array<{
  date: string; //ISO 8601形式のコンテスト開始時刻。(GMT)
  contestName: string;
  url: string;
}>;

// 日程の一覧をGASのAPIからもらってDBに登録する
async function fetchSchedules() {
  const contests = await axios
    .get<fetchResponse>(`${process.env.FETCH_URL}`)
    .catch((e: AxiosError) => {
      throw e;
    });

  console.log(contests.data);

  for (const e of contests.data) {
    await prisma.contest.upsert({
      where: {
        url: e.url,
      },
      create: {
        url: e.url,
        name: e.contestName,
        date: e.date,
      },
      update: {
        url: e.url,
        name: e.contestName,
        date: e.date,
      },
    });
  }

  console.log('done.');
}
