import axios from 'axios';
import { NonSensitiveDiaryEntry, DiaryEntry, NewDiaryEntry } from './types';

const baseUrl = 'http://localhost:3001/api/diaries'

export const getDiaries = () =>
  axios.get<NonSensitiveDiaryEntry[]>(baseUrl).then(response => response.data)

export const createDiary = (object: NewDiaryEntry) =>
  axios.post<DiaryEntry[]>(baseUrl, object).then(response => response.data)