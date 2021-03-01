import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {fileUpload} from "../../http/fileUpload";
import conf from "../../config"

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '0 10px',
	borderWidth: 2,
	borderRadius: 2,
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out',
	cursor: 'pointer',
};

const activeStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

export default function StyledFileDropzone(props) {
	const [fileUrl, setFileUrl] = useState(props.file);

	useEffect(() => {
		setFileUrl(props.file)
	}, [props.file])

	const onDrop = useCallback((acceptedFiles) => {
		const file = acceptedFiles[0];
		const formData = new FormData();
		formData.append('selectedFile', file);

		fileUpload(formData).then((res) => {
			props.func(res.data.result);
			setFileUrl(res.data.result);
		}).catch((err) => {
			console.log(err);
		})
	}, [])

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject
	} = useDropzone({onDrop});

	const style = useMemo(() => ({
		...baseStyle,
		...(isDragActive ? activeStyle : {}),
		...(isDragAccept ? acceptStyle : {}),
		...(isDragReject ? rejectStyle : {})
	}), [
		isDragActive,
		isDragReject,
		isDragAccept
	]);

	return (
		<>
			<div>{props.title}</div>
			<div {...getRootProps({style})}>
				<input {...getInputProps()} />
				<>
					<CloudUploadIcon className={fileUrl ? 'text-success' : null} style={{fontSize: 64}}/>
					<p style={{textAlign: 'center'}}>Drop file here or click here to upload</p>
				</>
			</div>
		</>
	);
}
