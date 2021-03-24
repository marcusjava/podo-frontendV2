import dayjs from "dayjs";

export default function formateDate(date, format) {
  return dayjs(date).format(format);
}
