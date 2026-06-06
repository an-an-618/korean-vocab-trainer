export type OralExamQuestion = {
  id: string;
  lesson: string;
  question: string;
  answer: string;
  focus: string;
};

export const oralExamQuestions: OralExamQuestion[] = [
  { id: "oral-01", lesson: "2과", question: "어느 나라 사람이에요?", answer: "저는 중국 사람이에요.", focus: "国籍" },
  { id: "oral-02", lesson: "2과", question: "국적이 뭐예요?", answer: "중국이에요.", focus: "国籍" },
  { id: "oral-03", lesson: "2과", question: "직업이 뭐예요?", answer: "저는 학생이에요.", focus: "职业" },
  { id: "oral-04", lesson: "2과", question: "무슨 일 하세요?", answer: "저는 요리사예요.", focus: "职业" },
  { id: "oral-05", lesson: "2과", question: "이름이 뭐예요?", answer: "제 이름은 김재민이에요.", focus: "姓名" },
  { id: "oral-06", lesson: "2과", question: "로버트 씨는 의사예요?", answer: "네, 의사예요.", focus: "N이에요" },
  { id: "oral-07", lesson: "2과", question: "웨이 씨는 일본 사람이에요?", answer: "아니요, 중국 사람이에요.", focus: "否定回答" },
  { id: "oral-08", lesson: "3과", question: "뭐 드릴까요?", answer: "비빔밥 하나하고 김밥 셋 주세요.", focus: "点餐" },
  { id: "oral-09", lesson: "3과", question: "뭐 마실래요?", answer: "저는 홍차요.", focus: "饮料" },
  { id: "oral-10", lesson: "3과", question: "김치 좀 더 드릴까요?", answer: "네, 김치 좀 더 주세요.", focus: "请求" },
  { id: "oral-11", lesson: "3과", question: "맥주 몇 병 드릴까요?", answer: "맥주 두 병 주세요.", focus: "数量" },
  { id: "oral-12", lesson: "3과", question: "커피를 마실래요?", answer: "아니요, 저는 녹차를 마셔요.", focus: "选择" },
  { id: "oral-13", lesson: "3과", question: "잠깐만 기다리세요.", answer: "네, 알겠습니다.", focus: "课堂/服务表达" },
  { id: "oral-14", lesson: "4과", question: "구두 있어요?", answer: "네, 있어요.", focus: "有无" },
  { id: "oral-15", lesson: "4과", question: "구두 한 켤레에 얼마예요?", answer: "칠만 구천팔백 원이에요.", focus: "价格" },
  { id: "oral-16", lesson: "4과", question: "이 사과는 하나에 얼마예요?", answer: "이천 원이에요.", focus: "单价" },
  { id: "oral-17", lesson: "4과", question: "모두 얼마예요?", answer: "모두 십삼만 육천 원이에요.", focus: "总价" },
  { id: "oral-18", lesson: "4과", question: "너무 비싸요. 좀 깎아 주세요.", answer: "그럼 칠만 육천 원 주세요.", focus: "讲价" },
  { id: "oral-19", lesson: "4과", question: "저 책은 한국어 책이에요?", answer: "네, 한국어 책이에요.", focus: "指示词" },
  { id: "oral-20", lesson: "5과", question: "오늘 수업이 있어요?", answer: "네, 있어요.", focus: "课程" },
  { id: "oral-21", lesson: "5과", question: "요즘 수업이 많아요?", answer: "네, 많아요.", focus: "近况" },
  { id: "oral-22", lesson: "5과", question: "모두 몇 개 있어요?", answer: "모두 세 개 있어요.", focus: "数量" },
  { id: "oral-23", lesson: "5과", question: "주말에 보통 뭐 해요?", answer: "저는 보통 주말에 친구하고 영화를 봐요.", focus: "周末" },
  { id: "oral-24", lesson: "5과", question: "영화를 자주 봐요?", answer: "아니요, 가끔 봐요.", focus: "频率" },
  { id: "oral-25", lesson: "5과", question: "무슨 음식을 좋아해요?", answer: "저는 비빔밥을 좋아해요.", focus: "喜好" },
  { id: "oral-26", lesson: "5과", question: "커피를 마셔요?", answer: "네, 저는 커피를 마셔요.", focus: "饮食" },
  { id: "oral-27", lesson: "6과", question: "생일이 언제예요?", answer: "제 생일은 사월 이십칠 일이에요.", focus: "日期" },
  { id: "oral-28", lesson: "6과", question: "오늘은 무슨 요일이에요?", answer: "수요일이에요.", focus: "星期" },
  { id: "oral-29", lesson: "6과", question: "내일은 몇 월 며칠이에요?", answer: "내일은 십이월 이십삼 일이에요.", focus: "日期" },
  { id: "oral-30", lesson: "6과", question: "언제 한국어 수업을 해요?", answer: "매주 월요일하고 수요일에 해요.", focus: "课程时间" },
  { id: "oral-31", lesson: "6과", question: "몇 시부터 몇 시까지 한국어 수업을 해요?", answer: "오전 아홉 시 오십 분부터 열한 시 이십오 분까지 해요.", focus: "부터/까지" },
  { id: "oral-32", lesson: "6과", question: "지금 몇 시예요?", answer: "지금 아홉 시 이십 분이에요.", focus: "时间" },
  { id: "oral-33", lesson: "6과", question: "보통 몇 시에 일어나요?", answer: "저는 보통 아침 일곱 시에 일어나요.", focus: "作息" },
  { id: "oral-34", lesson: "6과", question: "보통 몇 시에 자요?", answer: "저는 보통 밤 열한 시에 자요.", focus: "作息" },
  { id: "oral-35", lesson: "7과", question: "오늘 몇 시에 일어났어요?", answer: "오늘은 오전 여덟 시에 일어났어요.", focus: "过去时" },
  { id: "oral-36", lesson: "7과", question: "어제 몇 시에 잤어요?", answer: "어제는 새벽 한 시에 잤어요.", focus: "过去时" },
  { id: "oral-37", lesson: "7과", question: "어제 뭐 했어요?", answer: "저는 어제 도서관에서 한국어를 공부했어요.", focus: "过去日程" },
  { id: "oral-38", lesson: "7과", question: "평소에 운동해요?", answer: "네, 운동을 자주 해요.", focus: "频率" },
  { id: "oral-39", lesson: "7과", question: "무슨 운동을 해요?", answer: "수영해요. 태권도를 해요.", focus: "运动" },
  { id: "oral-40", lesson: "7과", question: "보통 언제 운동을 해요?", answer: "저는 보통 토요일 오후에 운동해요.", focus: "时间" },
  { id: "oral-41", lesson: "7과", question: "주말에 어디에 갔어요?", answer: "주말에 공원에 갔어요.", focus: "地点" },
  { id: "oral-42", lesson: "7과", question: "거기에 자주 가요?", answer: "네, 자주 가요.", focus: "频率" },
  { id: "oral-43", lesson: "8과", question: "요즘 날씨가 어때요?", answer: "요즘 날씨가 따뜻해요.", focus: "天气" },
  { id: "oral-44", lesson: "8과", question: "도서관에 자주 가요? 거기까지 걸어서 얼마나 걸려요?", answer: "네, 자주 가요. 십오 분 걸려요.", focus: "路程" },
  { id: "oral-45", lesson: "8과", question: "학교 안에 커피숍이 있어요?", answer: "네, 있어요.", focus: "位置" },
  { id: "oral-46", lesson: "8과", question: "여기에서 커피숍까지 얼마나 걸려요?", answer: "걸어서 십 분 걸려요.", focus: "耗时" },
  { id: "oral-47", lesson: "8과", question: "기숙사에 세탁소가 있어요?", answer: "아니요, 없어요.", focus: "有无" },
  { id: "oral-48", lesson: "8과", question: "그럼 학교에 세탁소가 있어요?", answer: "네, 있어요. 식당 앞에 세탁소가 있어요.", focus: "位置" },
  { id: "oral-49", lesson: "8과", question: "기숙사 근처에 뭐가 있어요?", answer: "기숙사 근처에 운동장하고 미용실이 있어요.", focus: "附近" },
  { id: "oral-50", lesson: "8과", question: "방에 냉장고가 없죠?", answer: "네, 없어요.", focus: "确认" },
  { id: "oral-51", lesson: "8과", question: "방에 소파가 있어요?", answer: "아니요, 없어요.", focus: "房间" },
  { id: "oral-52", lesson: "8과", question: "집에서 학교까지 얼마나 걸려요?", answer: "지하철을 타고 한 시간 걸려요.", focus: "交通" },
  { id: "oral-53", lesson: "8과", question: "화장실은 어디에 있어요?", answer: "이쪽으로 쭉 가세요. 오른쪽에 있어요.", focus: "问路" },
  { id: "oral-54", lesson: "8과", question: "우체국은 어디에 있어요?", answer: "우체국은 병원 건너편에 있어요.", focus: "位置" },
  { id: "oral-55", lesson: "9과", question: "여보세요. 거기 애니 씨 집이지요?", answer: "네, 그런데요. 실례지만 누구세요?", focus: "电话确认" },
  { id: "oral-56", lesson: "9과", question: "누가 선생님이에요?", answer: "저분이 우리 교수님이세요.", focus: "尊敬" },
  { id: "oral-57", lesson: "9과", question: "애니 씨 좀 바꿔 주세요.", answer: "네, 잠깐만 기다리세요.", focus: "转接电话" },
  { id: "oral-58", lesson: "9과", question: "지금 전화 괜찮아요?", answer: "네, 괜찮아요.", focus: "电话礼貌" },
  { id: "oral-59", lesson: "9과", question: "마이클 씨를 좀 바꿔 주세요.", answer: "지금 자고 있어요.", focus: "进行时" },
  { id: "oral-60", lesson: "9과", question: "지금 뭐 하고 있어요?", answer: "지금 저녁을 먹고 있어요.", focus: "进行时" },
];

export const oralExamLessons = Array.from(
  new Set(oralExamQuestions.map((question) => question.lesson)),
);

export function getOralExamQuestionsByLesson(lesson: string) {
  return oralExamQuestions.filter((question) => question.lesson === lesson);
}
