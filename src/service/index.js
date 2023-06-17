import Config from 'react-native-config';
import Get from './Get';
import Post from './Post';
import Put from './Put';
import Delete from './Delete';

// GET
const absence = STAFF_ID =>
  Get('close/absence/absence?staff_id=' + STAFF_ID, false);

const absenceHistory = (USER_ID, date, date2) =>
  Get(
    'close/absence/history?staff_id=' +
      USER_ID +
      '&from=' +
      date +
      '&to=' +
      date2,
    false,
  );

const absenceHistoryExtra = (USER_ID, date, date2) =>
  Get(
    'close/absence/historyExtra?staff_id=' +
      USER_ID +
      '&from=' +
      date +
      '&to=' +
      date2,
    false,
  );

const absenceHistoryRequests = (USER_ID, page, date, date2) =>
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
  );

const menu = STAFF_ID =>
  Get('close/absence/menu?staff_id=' + STAFF_ID + '&version=2023-04-19', false);

const chart = STAFF_ID =>
  Get('close/absence/menu/graphic?staff_id=' + STAFF_ID, false);

const absenceLCheck = (USER_ID, requests_id) =>
  Get(
    'close/absence/checkAbsenceLocation?user_id=' +
      USER_ID +
      '&requests_id=' +
      requests_id,
    false,
  );

const shift_staff = (USER_ID, date, shift) =>
  Get(
    'close/absence/shift?staff_id=' +
      USER_ID +
      '&start=' +
      date +
      '&shift_id=' +
      shift,
    false,
  );

const shiftChange = (USER_ID, staff_id) =>
  Get(
    'close/absence/shift/listChange?user_id=' +
      USER_ID +
      '&staff_id=' +
      staff_id,
    false,
  );

const getPermissionCat = () =>
  Get('close/absence/requests/getPermissionCat', false);

const myShift = id => Get('close/absence/shift/myShift?staff_id=' + id, false);

const listChangeShift = id => Get('close/absence/shiftChange?id=' + id, false);

const listRequest = id =>
  Get('close/absence/requests/absenceList?staff_id=' + id, false);

const listFile = id => Get('close/absence/requests/listFile?id=' + id, false);

const absenceSchedule = id =>
  Get('close/absence/absence/schedule?staff_id=' + id, false);

const changeShiftProposal = (id, page, date, date2) =>
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
  );
const changeShift = (id, page, date, date2) =>
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
  );
const message = (id, page) =>
  Get('close/absence/message?staff_id=' + id + '&page=' + page, false);
const Holiday = (id, page) =>
  Get('close/absence/holiday?staff_id=' + id + '&page=' + page, false);

//POST
const requestsStore = data => Post('close/absence/requests/store', false, data);
const login = data => Post('close/absence/login', false, data);
const leaveEnd = data => Post('close/absence/leaveEnd', false, data);
const scanCode = data => Post('open/staff/code', false, data);
const updateShiftStaff = data =>
  Post('close/absence/shiftChange/store', false, data);
const shiftChangeStore = data =>
  Post('close/absence/shiftChange/store', false, data);
const changeShiftApprove = data =>
  Post('close/absence/changeShiftApprove', false, data);
const readMessage = data => Post('close/absence/message/read', false, data);
const checkStaff = data => Post('close/absence/message/check', false, data);

// DELETE
const deleteImage = (id, token) =>
  Delete(`close/absence/requests/imageDelete/${id}`, false, token);

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
};

export default API;
