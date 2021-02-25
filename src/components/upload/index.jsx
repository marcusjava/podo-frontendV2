import React, { useState, useEffect } from 'react';
import { Upload, Button } from 'antd';
import './styles.css';
import { PlusOutlined } from '@ant-design/icons';

const UploadFile = ({ onFileUpload, imageURL }) => {
	const [fileList, setFileList] = useState([]);
	const [selectedFile, setSelectedFile] = useState('');

	useEffect(() => {
		if (imageURL) {
			setSelectedFile(imageURL);
		}
		return function clean() {
			setFileList([]);
		};
	}, [imageURL]);

	const props = {
		beforeUpload: (file) => {
			const fileURL = URL.createObjectURL(file);
			setSelectedFile(fileURL);
			onFileUpload(file);
			return false;
		},
		fileList,
	};
	return (
		<Upload name="avatar" listType="picture-card" className="avatar-uploader" {...props} multi={false}>
			{selectedFile ? (
				<img src={selectedFile} alt="Avatar" style={{ height: '150px', width: '150px' }} />
			) : (
				<Button>
					<PlusOutlined />
				</Button>
			)}
		</Upload>
	);
};

export default UploadFile;
