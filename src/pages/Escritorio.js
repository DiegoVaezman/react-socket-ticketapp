import { CloseCircleOutlined, RightOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Row, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useHideMenu } from "../hooks/useHideMenu";
import { cleanStorage, getUsuarioStorage } from "../helpers/getUsuarioStorage";
import { useNavigate } from "react-router-dom";
import { SocketContext } from "../context/SocketContext";

const { Title, Text } = Typography;

export const Escritorio = () => {
  const { socket } = useContext(SocketContext);
  useHideMenu(false);
  const navigate = useNavigate();
  const [usuario] = useState(getUsuarioStorage());
  const [ticket, setTicket] = useState(null);
  const salir = () => {
    cleanStorage();
    navigate("/ingresar", { replace: true });
  };

  const siguienteTicket = () => {
    socket.emit("siguiente-ticket-trabajar", usuario, (ticket) => {
      setTicket(ticket);
    });
  };

  useEffect(() => {
    if (!usuario.agente || !usuario.escritorio) {
      return navigate("/ingresar", { replace: true });
    }
  }, [usuario, navigate]);
  return (
    <>
      <Row>
        <Col span={20}>
          <Title level={2}>{usuario.agente}</Title>
          <Text>Usted está trabajando en el escritorio: </Text>
          <Text type="success">{usuario.escritorio}</Text>
        </Col>

        <Col span={4} align="right">
          <Button shape="round" type="primary" danger onClick={salir}>
            <CloseCircleOutlined />
            Salir
          </Button>
        </Col>
      </Row>

      <Divider />
      {ticket && (
        <Row>
          <Col>
            <Text>Está atendiendo el ticket número: </Text>
            <Text style={{ fontSize: 30 }} type="danger">
              {ticket.number}
            </Text>
          </Col>
        </Row>
      )}

      <Row>
        <Col offset={18} span={6} align="right">
          <Button onClick={siguienteTicket} shape="round" type="primary">
            Siguiente
            <RightOutlined />
          </Button>
        </Col>
      </Row>
    </>
  );
};
