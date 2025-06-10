import api from "../../../apis/baseApi";

export const test = {
  getTranscript: async () => {
    const res = await api.get("/api/transcript-lines/4");
    console.log(res);
    return res.data;
  },
};