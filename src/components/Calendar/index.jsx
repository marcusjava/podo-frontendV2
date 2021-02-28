import React, { useEffect } from "react";
import { Col, Calendar as Scheduled, Badge } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getConsults } from "../../redux/actions/consultActions";
import { Link } from "react-router-dom";
import moment from "moment";
import "./styles.css";

export default function Calendar() {
  const { items } = useSelector((state) => state.consult.consults);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getConsults());
  }, [dispatch]);

  const getItemsByDay = (value) => {
    const date = moment(value).format("YYYY-MM-DD");

    const filtered =
      items &&
      items.filter((item) => moment(item.date).format("YYYY-MM-DD") === date);

    return filtered;
  };

  const handlePanelChange = (date) => {
    const query = {
      start: moment(date).startOf("month").format("YYYY-MM-DD"),
      end: moment(date).endOf("month").format("YYYY-MM-DD"),
    };

    dispatch(getConsults(query));
  };

  const dateCellRender = (value) => {
    const list = getItemsByDay(value);

    return (
      <ul className="events">
        {list.map((item) => (
          <li key={item._id}>
            <Badge
              dot
              title={`${moment(item.date).format("HH:mm")} -
                ${item.client.name} - ${item.status}`}
            >
              <Link
                to={`/home/consulta/${item._id}/anamnese`}
                style={{ fontSize: 12, fontWeight: "bold" }}
              >
                {moment(item.date).format("HH:mm")} -
                {item.client.name.slice(0, 11)} - {item.status}
              </Link>
            </Badge>
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
