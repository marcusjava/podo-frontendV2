import React, { useEffect } from "react";
import { Col, Calendar as Scheduled, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getConsults } from "../../redux/actions/consultActions";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import "./styles.css";

export default function Calendar() {
  const { items } = useSelector((state) => state.consult.consults);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConsults());
  }, [dispatch]);

  const getItemsByDay = (value) => {
    const date = dayjs(value).format("YYYY-MM-DD");

    const filtered =
      items &&
      items.filter((item) => dayjs(item.date).format("YYYY-MM-DD") === date);

    return filtered;
  };

  const handlePanelChange = (date) => {
    const query = {
      start: dayjs(date).startOf("month").format("YYYY-MM-DD"),
      end: dayjs(date).endOf("month").format("YYYY-MM-DD"),
    };

    dispatch(getConsults(query));
  };

  const dateCellRender = (value) => {
    const list = getItemsByDay(value);

    return (
      <ul className="events">
        {list.map((item) => (
          <li key={item._id}>
            <Link
              to={`/home/consulta/${item._id}/anamnese`}
              style={{ fontSize: 12, fontWeight: "bold" }}
            >
              <Badge dot>
                {" "}
                {dayjs(item.date).format("HH:mm")} -
                {item.client.name.slice(0, 11)} - {item.status}
              </Badge>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <Col span={24}>
      <Scheduled
        dateCellRender={dateCellRender}
        onPanelChange={handlePanelChange}
      />
    </Col>
  );
}
