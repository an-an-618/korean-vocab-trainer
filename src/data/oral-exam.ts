export type OralExamQuestion = {
  id: string;
  lesson: string;
  question: string;
  answer: string;
  focus: string;
  questionAudioSrc?: string;
};

export const oralExamQuestions: OralExamQuestion[] = [
  { id: "oral-01", lesson: "2과", question: "어느 나라 사람이에요?", answer: "저는 중국 사람이에요.", focus: "国籍", questionAudioSrc: "/audio/oral-exam/oral-sample-01.wav" },
  { id: "oral-02", lesson: "2과", question: "국적이 뭐예요?", answer: "중국이에요.", focus: "国籍", questionAudioSrc: "/audio/oral-exam/oral-sample-02.wav" },
  { id: "oral-03", lesson: "2과", question: "직업이 뭐예요?", answer: "저는 요리사예요.", focus: "职业", questionAudioSrc: "/audio/oral-exam/oral-sample-03.wav" },
  { id: "oral-04", lesson: "2과", question: "무슨 일 하세요?", answer: "저는 요리사예요.", focus: "职业", questionAudioSrc: "/audio/oral-exam/oral-sample-04.wav" },
  { id: "oral-05", lesson: "5과", question: "오늘 수업이 있어요?", answer: "네, 있어요.", focus: "课程", questionAudioSrc: "/audio/oral-exam/oral-sample-05.wav" },
  { id: "oral-06", lesson: "5과", question: "요즘 수업이 많아요?", answer: "네, 많아요.", focus: "近况", questionAudioSrc: "/audio/oral-exam/oral-sample-06.wav" },
  { id: "oral-07", lesson: "5과", question: "모두 몇 개 있어요?", answer: "모두 세 개 있어요.", focus: "数量", questionAudioSrc: "/audio/oral-exam/oral-sample-07.wav" },
  { id: "oral-08", lesson: "5과", question: "주말에 보통 뭐 해요?", answer: "저는 보통 주말에 친구하고 영화를 봐요.", focus: "周末", questionAudioSrc: "/audio/oral-exam/oral-sample-08.wav" },
  { id: "oral-09", lesson: "5과", question: "영화를 자주 봐요?", answer: "아니요, 가끔 봐요.", focus: "频率", questionAudioSrc: "/audio/oral-exam/oral-sample-09.wav" },
  { id: "oral-10", lesson: "5과", question: "무슨 {음식을/과일을/음료수를} 좋아해요?", answer: "저는 {비빔밥을/사이다를/사과를} 좋아해요.", focus: "喜好", questionAudioSrc: "/audio/oral-exam/oral-sample-10.wav" },
  { id: "oral-11", lesson: "5과", question: "커피를 마셔요?", answer: "네, 저는 커피를 마셔요. / 아니요, 저는 커피를 {안/못} 마셔요.", focus: "饮食", questionAudioSrc: "/audio/oral-exam/oral-sample-11.wav" },
  { id: "oral-12", lesson: "6과", question: "생일이 언제예요? / 생일은 몇 월 며칠이에요?", answer: "제 생일은 사월 이십칠 일이에요.", focus: "日期", questionAudioSrc: "/audio/oral-exam/oral-sample-12.wav" },
  { id: "oral-13", lesson: "6과", question: "오늘은 무슨 요일이에요?", answer: "수요일이에요.", focus: "星期", questionAudioSrc: "/audio/oral-exam/oral-sample-13.wav" },
  { id: "oral-14", lesson: "6과", question: "내일은 몇 월 며칠이에요?", answer: "내일은 12월 23일이에요.", focus: "日期", questionAudioSrc: "/audio/oral-exam/oral-sample-14.wav" },
  { id: "oral-15", lesson: "6과", question: "언제 한국어 수업을 해요?", answer: "매주 월요일하고 수요일 여덟 시부터 아홉 시 삼십오 분까지 해요.", focus: "课程时间", questionAudioSrc: "/audio/oral-exam/oral-sample-15.wav" },
  { id: "oral-16", lesson: "6과", question: "무슨 요일에 한국어 수업을 해요?", answer: "월요일하고 수요일에 해요.", focus: "星期", questionAudioSrc: "/audio/oral-exam/oral-sample-16.wav" },
  { id: "oral-17", lesson: "6과", question: "몇 시부터 몇 시까지 한국어 수업을 해요?", answer: "오전 아홉 시 오십 분부터 열한 시 이십오 분까지 한국어 수업을 해요.", focus: "부터/까지", questionAudioSrc: "/audio/oral-exam/oral-sample-17.wav" },
  { id: "oral-18", lesson: "6과", question: "지금 몇 시예요?", answer: "지금 아홉 시 이십 분이에요.", focus: "时间", questionAudioSrc: "/audio/oral-exam/oral-sample-18.wav" },
  { id: "oral-19", lesson: "6과", question: "보통 몇 시에 일어나요?", answer: "저는 보통 아침 일곱 시에 일어나요.", focus: "作息", questionAudioSrc: "/audio/oral-exam/oral-sample-19.wav" },
  { id: "oral-20", lesson: "7과", question: "오늘 몇 시에 일어났어요?", answer: "오늘은 오전 여덟 시에 일어났어요.", focus: "过去时", questionAudioSrc: "/audio/oral-exam/oral-sample-20.wav" },
  { id: "oral-21", lesson: "6과", question: "보통 몇 시에 자요?", answer: "저는 보통 밤 열한 시에 자요.", focus: "作息", questionAudioSrc: "/audio/oral-exam/oral-sample-21.wav" },
  { id: "oral-22", lesson: "7과", question: "어제 몇 시에 잤어요?", answer: "어제는 새벽 한 시에 잤어요.", focus: "过去时", questionAudioSrc: "/audio/oral-exam/oral-sample-22.wav" },
  { id: "oral-23", lesson: "7과", question: "{오늘/내일/모레} 뭐 해요?", answer: "백화점에 가요. 그리고 옷을 사요.", focus: "日程", questionAudioSrc: "/audio/oral-exam/oral-sample-23.wav" },
  { id: "oral-24", lesson: "7과", question: "{어제/그제} 뭐 했어요?", answer: "저는 {어제/그제} 도서관에서 한국어를 공부했어요.", focus: "过去日程", questionAudioSrc: "/audio/oral-exam/oral-sample-24.wav" },
  { id: "oral-25", lesson: "7과", question: "평소에 운동해요?", answer: "네, 운동을 자주 해요.", focus: "频率", questionAudioSrc: "/audio/oral-exam/oral-sample-25.wav" },
  { id: "oral-26", lesson: "7과", question: "무슨 운동을 해요?", answer: "수영해요. / 태권도를 해요. / 요가를 해요.", focus: "运动", questionAudioSrc: "/audio/oral-exam/oral-sample-26.wav" },
  { id: "oral-27", lesson: "7과", question: "보통 언제 운동을 해요?", answer: "저는 보통 토요일 오후에 운동해요.", focus: "时间", questionAudioSrc: "/audio/oral-exam/oral-sample-27.wav" },
  { id: "oral-28", lesson: "7과", question: "주말에 어디에 갔어요?", answer: "주말에 공원에 갔어요.", focus: "地点", questionAudioSrc: "/audio/oral-exam/oral-sample-28.wav" },
  { id: "oral-29", lesson: "7과", question: "거기에 자주 가요?", answer: "네, 자주 가요. / 아니요, 별로 안 가요.", focus: "频率", questionAudioSrc: "/audio/oral-exam/oral-sample-29.wav" },
  { id: "oral-30", lesson: "8과", question: "요즘 날씨가 어때요?", answer: "요즘 날씨가 따뜻해요.", focus: "天气", questionAudioSrc: "/audio/oral-exam/oral-sample-30.wav" },
  { id: "oral-31", lesson: "8과", question: "어제 도서관에 갔지요?", answer: "네, 갔어요.", focus: "确认", questionAudioSrc: "/audio/oral-exam/oral-sample-31.wav" },
  { id: "oral-32", lesson: "8과", question: "도서관에 자주 가요? 거기까지 걸어서 얼마나 걸려요?", answer: "네, 자주 가요. 십오 분 걸려요.", focus: "路程", questionAudioSrc: "/audio/oral-exam/oral-sample-32.wav" },
  { id: "oral-33", lesson: "8과", question: "학교 안에 커피숍이 있어요?", answer: "네, 있어요.", focus: "位置", questionAudioSrc: "/audio/oral-exam/oral-sample-33.wav" },
  { id: "oral-34", lesson: "8과", question: "여기에서 커피숍까지 얼마나 걸려요?", answer: "걸어서 십 분 걸려요.", focus: "耗时", questionAudioSrc: "/audio/oral-exam/oral-sample-34.wav" },
  { id: "oral-35", lesson: "8과", question: "기숙사에 세탁소가 있어요?", answer: "아니요, 없어요.", focus: "有无", questionAudioSrc: "/audio/oral-exam/oral-sample-35.wav" },
  { id: "oral-36", lesson: "8과", question: "그럼 학교에 세탁소가 있어요? 거기까지 얼마나 걸려요?", answer: "네, 있어요. 식당 앞에 세탁소가 있어요. 여기에서 세탁소까지 자전거를 타고 십오 분 걸려요.", focus: "位置/路程", questionAudioSrc: "/audio/oral-exam/oral-sample-36.wav" },
  { id: "oral-37", lesson: "8과", question: "기숙사 근처에 뭐가 있어요?", answer: "기숙사 근처에 운동장하고 미용실이 있어요.", focus: "附近", questionAudioSrc: "/audio/oral-exam/oral-sample-37.wav" },
  { id: "oral-38", lesson: "8과", question: "방에 냉장고가 없죠?", answer: "네, 없어요. / 아니요, 있어요.", focus: "确认", questionAudioSrc: "/audio/oral-exam/oral-sample-38.wav" },
  { id: "oral-39", lesson: "8과", question: "방에 소파가 있어요?", answer: "아니요, 없어요.", focus: "房间", questionAudioSrc: "/audio/oral-exam/oral-sample-39.wav" },
  { id: "oral-40", lesson: "8과", question: "집에서 학교까지 얼마나 걸려요?", answer: "지하철을 타고 한 시간 걸려요.", focus: "交通", questionAudioSrc: "/audio/oral-exam/oral-sample-40.wav" },
  { id: "oral-41", lesson: "2과", question: "이름이 뭐예요?", answer: "제 이름은 김재민이에요.", focus: "姓名" },
  { id: "oral-42", lesson: "2과", question: "로버트 씨는 의사예요?", answer: "네, 의사예요.", focus: "N이에요" },
  { id: "oral-43", lesson: "3과", question: "뭐 드릴까요?", answer: "비빔밥 하나하고 김밥 셋 주세요.", focus: "点餐" },
  { id: "oral-44", lesson: "3과", question: "뭐 마실래요?", answer: "저는 홍차요.", focus: "饮料" },
  { id: "oral-45", lesson: "3과", question: "김치 좀 더 드릴까요?", answer: "네, 김치 좀 더 주세요.", focus: "请求" },
  { id: "oral-46", lesson: "3과", question: "맥주 몇 병 드릴까요?", answer: "맥주 두 병 주세요.", focus: "数量" },
  { id: "oral-47", lesson: "3과", question: "커피를 마실래요?", answer: "아니요, 저는 녹차를 마셔요.", focus: "选择" },
  { id: "oral-48", lesson: "3과", question: "잠깐만 기다리세요.", answer: "네, 알겠습니다.", focus: "课堂/服务表达" },
  { id: "oral-49", lesson: "4과", question: "구두 있어요?", answer: "네, 있어요.", focus: "有无" },
  { id: "oral-50", lesson: "4과", question: "구두 한 켤레에 얼마예요?", answer: "칠만 구천팔백 원이에요.", focus: "价格" },
  { id: "oral-51", lesson: "4과", question: "이 사과는 하나에 얼마예요?", answer: "이천 원이에요.", focus: "单价" },
  { id: "oral-52", lesson: "4과", question: "모두 얼마예요?", answer: "모두 십삼만 육천 원이에요.", focus: "总价" },
  { id: "oral-53", lesson: "4과", question: "너무 비싸요. 좀 깎아 주세요.", answer: "그럼 칠만 육천 원 주세요.", focus: "讲价" },
  { id: "oral-54", lesson: "4과", question: "저 책은 한국어 책이에요?", answer: "네, 한국어 책이에요.", focus: "指示词" },
  { id: "oral-55", lesson: "9과", question: "여보세요. 거기 애니 씨 집이지요?", answer: "네, 그런데요. 실례지만 누구세요?", focus: "电话确认" },
  { id: "oral-56", lesson: "9과", question: "누가 선생님이에요?", answer: "저분이 우리 교수님이세요.", focus: "尊敬" },
  { id: "oral-57", lesson: "9과", question: "애니 씨 좀 바꿔 주세요.", answer: "네, 잠깐만 기다리세요.", focus: "转接电话" },
  { id: "oral-58", lesson: "9과", question: "지금 전화 괜찮아요?", answer: "네, 괜찮아요.", focus: "电话礼貌" },
  { id: "oral-59", lesson: "9과", question: "마이클 씨를 좀 바꿔 주세요.", answer: "지금 자고 있어요.", focus: "进行时" },
  { id: "oral-60", lesson: "9과", question: "지금 뭐 하고 있어요?", answer: "지금 저녁을 먹고 있어요.", focus: "进行时" },
];

export const oralExamLessons = Array.from(
  new Set(oralExamQuestions.map((question) => question.lesson)),
).sort((left, right) => Number.parseInt(left, 10) - Number.parseInt(right, 10));

export function getOralExamQuestionsByLesson(lesson: string) {
  return oralExamQuestions.filter((question) => question.lesson === lesson);
}
