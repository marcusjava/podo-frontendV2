import React from "react";

import { CircularProgressbar } from "react-circular-progressbar";

import { Container, FileInfo, Preview } from "./styles";
import { MdCheckCircle, MdError, MdLink } from "react-icons/md";
import { AiFillEye } from "react-icons/ai";
import moment from "moment";

const FileList = ({ files, onDelete }) =>
  files.length === 0 ? (
    <p>Nenhuma foto encontrada</p>
  ) : (
    <Container>
      {files.map((file) => (
        <li key={file.id}>
          <FileInfo>
            <Preview src={file.preview} />
            <div>
              <p>
                Criado em: {moment(file.createdAt).format("DD-MM-YYYY HH:mm")}
              </p>
              <span>
                {file.readableSize}{" "}
                {!!file.url && (
                  <button onClick={(e) => onDelete(file.id, e)}>Excluir</button>
                )}
              </span>
            </div>
          </FileInfo>
          <div>
            {!file.uploaded && !file.error && (
              <CircularProgressbar
                styles={{ root: { width: 24 }, path: { stroke: "#7159c1" } }}
                strokeWidth={10}
                percentage={file.progress}
              />
            )}
            {file.url && (
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                <AiFillEye
                  style={{ marginRight: 8, marginLeft: 8 }}
                  size={24}
                  color="#222"
                />
              </a>
            )}
            {file.uploaded && <MdCheckCircle size={24} color="#78e5d5" />}
            {file.error && <MdError size={24} color="#e57878" />}
          </div>
        </li>
      ))}
    </Container>
  );

export default FileList;
