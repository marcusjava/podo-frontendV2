import React, { useState, useEffect } from 'react';
import { Container, Content } from './styles';
import { uniqueId } from 'lodash';
import fileSize from 'filesize';
import FileList from '../FileList';
import Dropzone from '../Dropzone';
import axios from 'axios';

const Upload = ({ id }) => {
	const [uploadedFiles, setUploadedFiles] = useState([]);

	useEffect(() => {
		async function getPhotos(id) {
			const response = await axios.get(`/photos/${id}`);
			setUploadedFiles(
				response.data.map((file) => ({
					id: file._id,
					name: file.name,
					readableSize: fileSize(file.size),
					preview: file.url,
					uploaded: true,
					url: file.url,
				}))
			);
		}

		getPhotos(id);
		return () => {
			uploadedFiles.forEach((file) => URL.revokeObjectURL(file.preview));
		};
	}, []);

	const updateFile = (id, data) => {
		setUploadedFiles((uploadedFiles) =>
			uploadedFiles.map((file) => (id === file.id ? { ...file, ...data } : file))
		);
	};

	const processUpload = async (uploadedFile) => {
		const data = new FormData();
		data.append('photo', uploadedFile.file);
		axios
			.post(`/photos/${id}`, data, {
				onUploadProgress: (e) => {
					const progress = parseInt(Math.round((e.loaded * 100) / e.total));
					updateFile(uploadedFile.id, { progress });
				},
			})
			.then(({ data }) => {
				updateFile(uploadedFile.id, { uploaded: true, id: data._id, url: data.url });
			})
			.catch((error) => updateFile(uploadedFile.id, { error: true }));
	};

	const handleUpload = (files) => {
		const newFiles = files.map((file) => ({
			file,
			id: uniqueId(),
			name: file.name,
			readableSize: fileSize(file.size),
			preview: URL.createObjectURL(file),
			progress: 0,
			uploaded: false,
			error: false,
			url: null,
		}));

		setUploadedFiles((uploadedFiles) => [...uploadedFiles, ...newFiles]);

		newFiles.forEach(processUpload);
	};

	const handleDelete = async (id, e) => {
		e.preventDefault();
		try {
			await axios.delete(`/photos/${id}`);
			setUploadedFiles((files) => files.filter((file) => file.id !== id));
		} catch (error) {
			console.log(error);
		}
	};

	return (
		<Container>
			<Content>
				<Dropzone onUpload={handleUpload} />
				{!!uploadedFiles.length && <FileList files={uploadedFiles} onDelete={handleDelete} />}
			</Content>
		</Container>
	);
};

export default Upload;
