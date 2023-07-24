import Config from 'react-native-config';
import Get from './Get';
import Post from './Post';
import Put from './Put';
import Delete from './Delete';
import FileUpload from './FileUpload';

// GET
const absence = (STAFF_ID, TOKEN) =>
  Get('close/absence/absence?staff_id=' + STAFF_ID, false, TOKEN);

const absenceHistory = (USER_ID, date, date2, TOKEN) =>
  Get(
    'close/absence/history?staff_id=' +
      USER_ID +
      '&from=' +
      date +
      '&to=' +
      date2,
    false,
    TOKEN,
  );

const absenceHistoryExtra = (USER_ID, date, date2, TOKEN) =>
  Get(
    'close/absence/historyExtra?staff_id=' +
      USER_ID +
      '&from=' +
      date +
      '&to=' +
      date2,
    false,
    TOKEN,
  );

const absenceHistoryRequests = (USER_ID, page, date, date2, TOKEN) =>
  Get(
    'close/absence/requests/history?staff_id=' +
      USER_ID +
      '&page=' +
      page +
      '&from=' +
      date +
      '&to=' +
      date2,
    false,
    TOKEN,
  );

const menu = (STAFF_ID, TOKEN) =>
  Get(
    'close/absence/menu?staff_id=' + STAFF_ID + '&version=2023-04-19',
    false,
    TOKEN,
  );

const chart = (STAFF_ID, TOKEN) =>
  Get('close/absence/menu/graphic?staff_id=' + STAFF_ID, false, TOKEN);

const absenceLCheck = (USER_ID, requests_id, TOKEN) =>
  Get(
    'close/absence/checkAbsenceLocation?user_id=' +
      USER_ID +
      '&requests_id=' +
      requests_id,
    false,
    TOKEN,
  );

const shift_staff = (USER_ID, date, shift, TOKEN) =>
  Get(
    'close/absence/shift?staff_id=' +
      USER_ID +
      '&start=' +
      date +
      '&shift_id=' +
      shift,
    false,
    TOKEN,
  );

const shiftChange = (USER_ID, staff_id, TOKEN) =>
  Get(
    'close/absence/shift/listChange?user_id=' +
      USER_ID +
      '&staff_id=' +
      staff_id,
    false,
    TOKEN,
  );

const getPermissionCat = TOKEN =>
  Get('close/absence/requests/getPermissionCat', false, TOKEN);

const myShift = (id, TOKEN) =>
  Get('close/absence/shift/myShift?staff_id=' + id, false, TOKEN);

const listChangeShift = (id, TOKEN) =>
  Get('close/absence/shiftChange?id=' + id, false, TOKEN);

const listRequest = (id, TOKEN) =>
  Get('close/absence/requests/absenceList?staff_id=' + id, false, TOKEN);

const listFile = (id, TOKEN) =>
  Get('close/absence/requests/listFile?id=' + id, false, TOKEN);

const absenceSchedule = (id, TOKEN) =>
  Get('close/absence/absence/schedule?staff_id=' + id, false, TOKEN);

const changeShiftProposal = (id, page, date, date2, TOKEN) =>
  Get(
    'close/absence/changeShiftProposal?staff_id=' +
      id +
      '&page=' +
      page +
      '&from=' +
      date +
      '&to=' +
      date2,
    false,
    TOKEN,
  );
const changeShift = (id, page, date, date2, TOKEN) =>
  Get(
    'close/absence/changeShift?staff_id=' +
      id +
      '&page=' +
      page +
      '&from=' +
      date +
      '&to=' +
      date2,
    false,
    TOKEN,
  );
const message = (id, page, TOKEN) =>
  Get('close/absence/message?staff_id=' + id + '&page=' + page, false, TOKEN);
const Holiday = (id, page, TOKEN) =>
  Get('close/absence/holiday?staff_id=' + id + '&page=' + page, false, TOKEN);

const getDataStaff = (currentPage, search, TOKEN) =>
  Get(
    'close/visit/getDataStaff?page=' + currentPage + '&name=' + search,
    false,
    TOKEN,
  );

const getDataCbox = TOKEN => Get('close/visit/getDataCbox', false, TOKEN);
//POST
const requestsStore = (data, TOKEN) =>
  Post('close/absence/requests/store', false, data, TOKEN);
const login = data => Post('open/absence/login', false, data);
const leaveEnd = (data, TOKEN) =>
  Post('close/absence/leaveEnd', false, data, TOKEN);
const scanCode = (data, TOKEN) => Post('open/staff/code', false, data, TOKEN);
const updateShiftStaff = (data, TOKEN) =>
  Post('close/absence/shiftChange/store', false, data, TOKEN);
const shiftChangeStore = (data, TOKEN) =>
  Post('close/absence/shiftChange/store', false, data, TOKEN);
const changeShiftApprove = (data, TOKEN) =>
  Post('close/absence/changeShiftApprove', false, data, TOKEN);
const readMessage = (data, TOKEN) =>
  Post('close/absence/message/read', false, data, TOKEN);
const checkStaff = (data, TOKEN) =>
  Post('close/absence/message/check', false, data, TOKEN);

// DELETE
const deleteImage = (id, token) =>
  Delete(`close/absence/requests/imageDelete/${id}`, false, token);

//  UPLOAD FILE
const visitEtc = (data, TOKEN) =>
  FileUpload('close/visit/storeEtc', data, TOKEN);

const API = {
  login,
  scanCode,
  absence,
  requestsStore,
  menu,
  absenceLCheck,
  absenceHistory,
  absenceHistoryExtra,
  absenceHistoryRequests,
  shift_staff,
  updateShiftStaff,
  shiftChange,
  getPermissionCat,
  myShift,
  shiftChangeStore,
  listChangeShift,
  listRequest,
  leaveEnd,
  listFile,
  deleteImage,
  absenceSchedule,
  changeShiftApprove,
  changeShift,
  changeShiftProposal,
  message,
  Holiday,
  readMessage,
  checkStaff,
  chart,
  getDataStaff,
  getDataCbox,
  visitEtc,
};

export default API;
