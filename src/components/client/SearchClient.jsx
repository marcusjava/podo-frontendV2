import React, { useEffect } from "react";
import { Select, Spin, Avatar } from "antd";
import { getClients } from "../../redux/actions/clientActions";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";

const { Option } = Select;

//Fazer a busca direto no backend visto que trazer todos os clientes ira afetar a perfomance

export default function SearchClient() {
  const { clients, loading } = useSelector((state) => state.client);

  const dispatch = useDispatch();

  const history = useHistory();

  useEffect(() => {
    //renderizando clientes
    dispatch(getClients({ limit: 50 }));
  }, [dispatch]);

  const handleSearch = (value) => {
    if (value === "") {
      dispatch(getClients({ limit: 50 }));
    }
    if (value.length > 3) {
      dispatch(getClients({ name: value }));
    }
  };

  return (
    <div>
      <Select
        showSearch
        allowClear
        notFoundContent={
          clients.items.length === 0 ? <Spin size="small" /> : null
        }
        style={{ width: "100%" }}
        size="large"
        optionFilterProp="children"
        loading={loading}
        placeholder="Pesquisa Cliente"
        filterOption={(input, option) => {
          return (
            option.children.props.children[1]
              .toLowerCase()
              .indexOf(input.toLowerCase()) >= 0
          );
        }}
        onSearch={handleSearch}
        onClear={() => dispatch(getClients({ limit: 50 }))}
        onChange={(value, option) => history.push(`/home/cliente/${value}`)}
      >
        {clients.items.map((item) => (
          <Option key={item._id} value={item._id}>
            <div>
              <span role="img" aria-label="Image" style={{ marginRight: 5 }}>
                <Avatar src={item.avatar_url} />
              </span>
              {item.name} - {item.contact}
            </div>
          </Option>
        ))}
      </Select>
    </div>
  );
}
