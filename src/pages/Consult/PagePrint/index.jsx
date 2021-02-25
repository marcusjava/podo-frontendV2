import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Logo from '../../../images/Logo.png';
import { useParams, useHistory } from 'react-router-dom';
import Spinner from '../../../components/common/Spinner';
import './styles.css';
import dayjs from 'dayjs';

// import { Container } from './styles';

function PagePrint() {
	const [consult, setConsult] = useState({});
	const [photos, setPhotos] = useState([]);

	const [loading, setLoading] = useState(true);

	const { id } = useParams();

	useEffect(() => {
		async function getConsult() {
			const response = await axios.get(`/consults/${id}/doc`);
			const photos = await axios.get(`/photos/${id}`);
			setConsult(response.data);
			setPhotos(
				photos.data.map((file) => ({
					id: file._id,
					name: file.name,
					url: file.url,
				}))
			);
			setLoading(false);
		}

		getConsult();
	}, []);
	return loading ? (
		<Spinner />
	) : (
		<div className="page">
			<div className="logo-container">
				<img src={Logo} alt="Logotipo" className="logo" />
			</div>
			<h2>Dados Cliente</h2>
			<div className="client-container">
				<p>
					<strong>Nome:</strong>
					{consult.name}
				</p>
				<p>
					<strong>Contato:</strong>
					{consult.contact}
				</p>
				<p>
					<strong>CPF:</strong>
					{consult.cpf}
				</p>
			</div>
			<div className="address-container">
				<p>
					<strong>Rua:</strong>
					{consult.address.street}
				</p>
				<p>
					<strong>Bairro:</strong>
					{consult.address.neighborhood}
				</p>
				<p>
					<strong>Cidade:</strong>
					{consult.address.city}
				</p>
				<p>
					<strong>Estado:</strong>
					{consult.address.state}
				</p>
			</div>
			<h2>Dados Consulta</h2>
			<div className="consult-container">
				<p>
					<strong>Data/Hora:{dayjs(consult.date).format('DD/MM/YYYY HH:mm')}</strong>
				</p>
				<h4 style={{ marginBottom: 15, marginTop: 15 }}>Procedimentos</h4>
				<ul className="item-list">
					{consult.procedures.map((item, index) => (
						<li key={index}>
							<strong>
								{item.name} - R${item.price},
							</strong>
						</li>
					))}
				</ul>
				<h4>Total: R${consult.price} </h4>
				<h4 style={{ marginTop: 15 }}>Anamnese</h4>
				<p style={{ marginBottom: 15, marginTop: 15 }}>
					<strong>Descrição proced.:</strong>
					{consult.anamnese.desc_proc}
				</p>
				<div className="anamnese-items">
					<p>
						<strong>Esporte:</strong> {consult.anamnese.esporte.option === true ? 'Sim' : 'Não'} Qt:{' '}
						{consult.anamnese.esporte.qt} x semana{' '}
					</p>
					<p>
						<strong>Pé predominante:</strong> {consult.anamnese.pe_predominante}
					</p>
					<p>
						<strong>Calçado</strong>Num: {consult.anamnese.calcado.num} Tipo:{' '}
						{consult.anamnese.calcado.tipo} Material: {consult.anamnese.calcado.material}
					</p>
					<p>
						<strong>
							Medicamento: {consult.anamnese.medicamento.option === true ? 'Sim' : 'Não'} -{' '}
							{consult.anamnese.medicamento.description}
						</strong>
					</p>
					<p>
						<strong>Alergia:</strong> {consult.anamnese.alergia.option === true ? 'Sim' : 'Não'} -{' '}
						{consult.anamnese.alergia.description}
					</p>
					<p>
						<strong>Doença:</strong> {consult.anamnese.doenca.option === true ? 'Sim' : 'Não'} -{' '}
						{consult.anamnese.doenca.description}
					</p>
					<p>
						<strong>Diabetico: </strong>
						{consult.anamnese.diabetico === true ? 'Sim' : 'Não'}
					</p>
					<p>
						<strong>Diabetico Familia: </strong>
						{consult.anamnese.diabetico_familia === true ? 'Sim' : 'Não'}
					</p>
					<p>
						<strong>Hipertensão: </strong>
						{consult.anamnese.hipertensao === true ? 'Sim' : 'Não'}
					</p>
					<p>
						<strong>Cardiopata: </strong>
						{consult.anamnese.cardiopata === true ? 'Sim' : 'Não'}
					</p>
					<p>
						<strong>Fumante: </strong>
						{consult.anamnese.fumante === true ? 'Sim' : 'Não'}
					</p>
					<p>
						<strong>Etilista: </strong>
						{consult.anamnese.etilista === true ? 'Sim' : 'Não'}
					</p>
					<p>
						<strong>DST: </strong>
						{consult.anamnese.dst === true ? 'Sim' : 'Não'}
					</p>
					<p>
						<strong>Grav/Lactação: </strong>
						{consult.anamnese.grav_lact === true ? 'Sim' : 'Não'}
					</p>
				</div>
				<p>
					<strong>Outros: </strong>
					{consult.anamnese.outros}
				</p>
				<div className="unhas-container">
					<p>
						<strong>Lesões nas Unhas</strong>
					</p>
					<ul className="item-list">
						{consult.anamnese.unhas_lesoes.map((item, index) => (
							<li key={index}>
								<strong>{item.key}</strong> - {item.value}
							</li>
						))}
					</ul>
				</div>
				<div className="pele-container">
					<p>
						<strong>Lesões na Pele</strong>
					</p>
					<ul className="item-list">
						{consult.anamnese.pele_lesoes.map((item, index) => (
							<li key={index}>
								<strong>{item.key}</strong> - {item.value}
							</li>
						))}
					</ul>
				</div>
				<div className="orto-container">
					<p>
						<strong>Lesões Ortopedicas</strong>
					</p>
					<ul className="item-list">
						{consult.anamnese.orto_lesoes.map((item, index) => (
							<li key={index}>
								<strong>{item.key}</strong> - {item.value}
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="pictures-container">
				<h4>Fotos</h4>
				<ul className="pictures-list">
					{photos.map((item) => (
						<li key={item.id}>
							<img className="picture" src={item.url} alt="fotos" />
						</li>
					))}
				</ul>
			</div>

			<footer className="footer-container">
				<div className="footer-item">
					<hr />
					<p>Estou ciente sobre a publicação das fotos nas redes sociais</p>
				</div>
			</footer>
		</div>
	);
}

export default PagePrint;
