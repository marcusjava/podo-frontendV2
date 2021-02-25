import styled from 'styled-components';

export const Container = styled.ul`
	margin-top: 20px;

	display: flex;
	flex-flow: row wrap;
	li {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin: 0px 10px 10px 0px;
		padding: 0px 5px;
		color: #444;
		margin-top: 15px;
		min-width: 300px;
	}
`;

export const FileInfo = styled.div`
	display: flex;
	align-items: center;
	div {
		display: flex;
		flex-direction: column;
		span {
			font-size: 12px;
			color: #999;
			margin-top: 5px;
			button {
				border: 0;
				background: transparent;
				color: #e57878;
				margin-left: 5px;
				cursor: pointer;
			}
		}
	}
`;

export const Preview = styled.div`
	width: 100px;
	height: 100px;
	border-radius: 5px;
	background-image: url(${(props) => props.src});
	background-repeat: no-repeat;
	background-size: cover;
	background-position: 50% 50%;
	margin-right: 10px;
`;
