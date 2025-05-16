// 회의 목록 더미 데이터
const dummyMeetings = [
  { 
    id: 1, 
    title: '프로젝트 진행 상황 회의', 
    date: '2025-05-13',
    participants: ['장준영 부장', '김범수 과장', '이지원 대리']
  },
  { 
    id: 2, 
    title: '신규 기능 기획 회의', 
    date: '2025-05-14',
    participants: ['장준영 부장', '김범수 과장', '박민준 사원']
  },
  { 
    id: 3, 
    title: '클라이언트 피드백 검토', 
    date: '2025-05-15',
    participants: ['장준영 부장', '이지원 대리', '최서연 과장']
  }
];

// 회의 상세 정보 더미 데이터
const dummyMeetingDetails = {
  1: {
    id: 1,
    title: '프로젝트 진행 상황 회의',
    date: '2025-05-13',
    participants: ['장준영 부장', '김범수 과장', '이지원 대리'],
    notes: {
      title: '프로젝트 진행 상황 회의',
      summary: '프로젝트 진행 상황을 검토하고 현재까지의 성과와 문제점을 논의했습니다. 녹음된 파일을 AI가 자동으로 텍스트화하고, 회의록과 ToDo 항목을 정리했습니다.',
      tasks: '- 로그인 페이지 디자인 개선 (담당: 김범수 과장)\n- 회의록 탭 구현 (담당: 이지원 대리)\n- ToDo & 일정 탭 구현 (담당: 장준영 부장)'
    },
    todos: [
      // 5월 15일 일정 - 업무
      { id: 1, text: '로그인 페이지 디자인 개선', completed: true, assignee: '김범수 과장', startDate: '2025-05-13', dueDate: '2025-05-15', type: 'task' },
      { id: 2, text: '회의록 탭 구현', completed: false, assignee: '이지원 대리', startDate: '2025-05-13', dueDate: '2025-05-15', type: 'task' },
      { id: 3, text: 'ToDo & 일정 탭 구현', completed: false, assignee: '장준영 부장', startDate: '2025-05-14', dueDate: '2025-05-15', type: 'task' },
      
      // 5월 17일 일정 - todo
      { id: 4, text: '데이터베이스 설계 검토', completed: false, assignee: '김범수 과장', startDate: '2025-05-15', dueDate: '2025-05-17', type: 'todo' },
      { id: 5, text: 'API 엔드포인트 정의', completed: false, assignee: '장준영 부장', startDate: '2025-05-16', dueDate: '2025-05-17', type: 'todo' },
      
      // 5월 20일 일정 - 업무
      { id: 6, text: '프론트엔드 프로토타입 개발', completed: false, assignee: '이지원 대리', startDate: '2025-05-17', dueDate: '2025-05-20', type: 'task' },
      { id: 7, text: '사용자 인증 로직 구현', completed: false, assignee: '김범수 과장', startDate: '2025-05-18', dueDate: '2025-05-20', type: 'task' },
      { id: 8, text: '회의 기록 저장 기능 개발', completed: false, assignee: '장준영 부장', startDate: '2025-05-18', dueDate: '2025-05-20', type: 'task' },
      
      // 5월 25일 일정 - todo
      { id: 9, text: '통합 테스트 진행', completed: false, assignee: '이지원 대리', startDate: '2025-05-22', dueDate: '2025-05-25', type: 'todo' },
      { id: 10, text: '코드 리뷰', completed: false, assignee: '장준영 부장', startDate: '2025-05-22', dueDate: '2025-05-25', type: 'todo' },
      
      // 5월 30일 일정 - 업무
      { id: 11, text: '최종 발표 자료 준비', completed: false, assignee: '김범수 과장', startDate: '2025-05-25', dueDate: '2025-05-30', type: 'task' },
      { id: 12, text: '배포 계획 수립', completed: false, assignee: '장준영 부장', startDate: '2025-05-26', dueDate: '2025-05-30', type: 'task' }
    ]
  },
  2: {
    id: 2,
    title: '신규 기능 기획 회의',
    date: '2025-05-14',
    participants: ['장준영 부장', '김범수 과장', '박민준 사원'],
    notes: {
      title: '신규 기능 기획 회의',
      summary: '사용자 요구사항에 따른 신규 기능 추가 방안을 논의했습니다. 음성 인식 기능과 자동 알림 기능에 대한 기술적 검토를 진행했습니다.',
      tasks: '- 음성 인식 API 검토 (담당: 박민준 사원)\n- 알림 시스템 설계 (담당: 김범수 과장)\n- UI/UX 디자인 초안 작성 (담당: 장준영 부장)'
    },
    todos: [
      { id: 1, text: '음성 인식 API 검토', completed: false, assignee: '박민준 사원', startDate: '2025-05-15', dueDate: '2025-05-17', type: 'todo' },
      { id: 2, text: '알림 시스템 설계', completed: false, assignee: '김범수 과장', startDate: '2025-05-16', dueDate: '2025-05-18', type: 'task' },
      { id: 3, text: 'UI/UX 디자인 초안 작성', completed: false, assignee: '장준영 부장', startDate: '2025-05-14', dueDate: '2025-05-16', type: 'task' }
    ]
  },
  3: {
    id: 3,
    title: '클라이언트 피드백 검토',
    date: '2025-05-15',
    participants: ['장준영 부장', '이지원 대리', '최서연 과장'],
    notes: {
      title: '클라이언트 피드백 검토',
      summary: '클라이언트로부터 받은 피드백을 검토하고 우선순위를 결정했습니다. 대시보드 개선과 데이터 시각화 기능이 가장 중요한 요구사항으로 확인되었습니다.',
      tasks: '- 대시보드 UI 개선 (담당: 최서연 과장)\n- 데이터 시각화 컴포넌트 개발 (담당: 이지원 대리)\n- 성능 최적화 (담당: 장준영 부장)'
    },
    todos: [
      { id: 1, text: '대시보드 UI 개선', completed: false, assignee: '최서연 과장', startDate: '2025-05-16', dueDate: '2025-05-20', type: 'task' },
      { id: 2, text: '데이터 시각화 컴포넌트 개발', completed: false, assignee: '이지원 대리', startDate: '2025-05-18', dueDate: '2025-05-22', type: 'task' },
      { id: 3, text: '성능 최적화', completed: false, assignee: '장준영 부장', startDate: '2025-05-16', dueDate: '2025-05-18', type: 'todo' },
      { id: 4, text: '사용자 테스트 진행', completed: false, assignee: '김범수 과장', startDate: '2025-05-22', dueDate: '2025-05-25', type: 'todo' },
      { id: 5, text: '서비스 배포 준비', completed: false, assignee: '박민준 사원', startDate: '2025-05-22', dueDate: '2025-05-25', type: 'task' },
      { id: 6, text: 'API 문서화', completed: false, assignee: '이지원 대리', startDate: '2025-05-24', dueDate: '2025-05-28', type: 'todo' },
      { id: 7, text: '기능 재검토 및 확인', completed: false, assignee: '장준영 부장', startDate: '2025-05-26', dueDate: '2025-05-28', type: 'task' },
      { id: 8, text: '클라이언트 중간 보고서 작성', completed: false, assignee: '최서연 과장', startDate: '2025-05-27', dueDate: '2025-05-30', type: 'task' }
    ]
  }
};

// 회의 목록 조회
export const getMeetings = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(dummyMeetings);
    }, 500);
  });
};

// 회의 상세 정보 조회
export const getMeetingDetails = (id) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const meeting = dummyMeetingDetails[id];
      if (meeting) {
        resolve(meeting);
      } else {
        reject(new Error('회의를 찾을 수 없습니다.'));
      }
    }, 500);
  });
};

// 회의록 업데이트
export const updateMeetingNotes = (id, notes) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (dummyMeetingDetails[id]) {
        dummyMeetingDetails[id].notes = { ...dummyMeetingDetails[id].notes, ...notes };
        resolve(dummyMeetingDetails[id]);
      } else {
        reject(new Error('회의를 찾을 수 없습니다.'));
      }
    }, 500);
  });
};

// ToDo 항목 업데이트
export const updateTodo = (meetingId, todoId, todoData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const meeting = dummyMeetingDetails[meetingId];
      if (meeting) {
        const todoIndex = meeting.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
          meeting.todos[todoIndex] = { ...meeting.todos[todoIndex], ...todoData };
          resolve(meeting);
        } else {
          reject(new Error('ToDo 항목을 찾을 수 없습니다.'));
        }
      } else {
        reject(new Error('회의를 찾을 수 없습니다.'));
      }
    }, 500);
  });
};

// ToDo 항목 추가
export const addTodo = (meetingId, todoData) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const meeting = dummyMeetingDetails[meetingId];
      if (meeting) {
        const newId = Math.max(0, ...meeting.todos.map(t => t.id)) + 1;
        const newTodo = { id: newId, ...todoData };
        meeting.todos.push(newTodo);
        resolve(meeting);
      } else {
        reject(new Error('회의를 찾을 수 없습니다.'));
      }
    }, 500);
  });
};

// ToDo 항목 삭제
export const deleteTodo = (meetingId, todoId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const meeting = dummyMeetingDetails[meetingId];
      if (meeting) {
        const todoIndex = meeting.todos.findIndex(todo => todo.id === todoId);
        if (todoIndex !== -1) {
          meeting.todos.splice(todoIndex, 1);
          resolve(meeting);
        } else {
          reject(new Error('ToDo 항목을 찾을 수 없습니다.'));
        }
      } else {
        reject(new Error('회의를 찾을 수 없습니다.'));
      }
    }, 500);
  });
};
