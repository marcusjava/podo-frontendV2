import React from 'react';
import Dropzone from 'react-dropzone';
import { DropContainer, UploadMessage } from './styles';

const UploadDropzone = ({ onUpload }) => {
	const renderDragMessage = (isDragActive, isDragReject) => {
		if (!isDragActive) {
			return <UploadMessage>Arraste seus arquivos aqui</UploadMessage>;
		}

		if (isDragReject) {
			return <UploadMessage type="error">Arquivo não permitido</UploadMessage>;
		}

		return <UploadMessage type="success">Solte o arquivo aqui</UploadMessage>;
	};

	return (
		<Dropzone accept="image/*" onDropAccepted={onUpload}>
			{({ getRootProps, getInputProps, isDragActive, isDragReject }) => (
				<DropContainer {...getRootProps()} isDragActive={isDragActive} isDragReject={isDragReject}>
					<input {...getInputProps()} />
					{renderDragMessage(isDragActive, isDragReject)}
				</DropContainer>
			)}
		</Dropzone>
	);
};

export default UploadDropzone;
