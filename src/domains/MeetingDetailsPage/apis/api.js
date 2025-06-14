import api from "../../../apis/baseApi";

export const getMeetingNotes = async (meetingId) => {
  
  const res = await api.get(`/api/meeting-notes/meeting/${meetingId}`);

  const data = res.data && {
    title: res.data[0].title,
    summary: res.data[0].content,
    id: res.data[0].id,
  }
  
  return data;
};

export const updateMeetingNotes = async (meetingNoteId, notes) => {
  console.log(notes);
  console.log(meetingNoteId);
  
  const body = {
    title: notes.title,
    content: notes.summary,
  }

  const res = await api.put(`/api/meeting-notes/${meetingNoteId}`, body);
  
  return res.data;
};