import moment from 'moment-timezone';

const timeZone = 'America/New_York';
const startHour = 9;
const startMinute = 30;

const endHour = 4;
const endMinute = 0;

export const currentISODate = () => moment.utc().format(); 
export const toISODate = (date) => moment.utc(date).format();
export const yearStartISODate = () => moment.tz(timeZone).startOf('year').hour(startHour).minute(startMinute).utc().format();
export const dayStartISODate = () => moment.tz(timeZone).hour(startHour).minute(startMinute).second(0).utc().format();
export const dayEndISODate = () => moment.tz(timeZone).hour(endHour).minute(endMinute).second(0).utc().format();

