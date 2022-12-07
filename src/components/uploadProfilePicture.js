import React, { useState } from 'react'
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';

import * as MeAPI from '../api/v0/me'
import * as AuthAPI from '../api/v0/auth'

const UploadProfilePicture = ({token, onDone, onError}) => {

    const [uploading, setUploading] = useState(false)

    const uploadPicture = async (file) => {
        setUploading(true)
        const response = await MeAPI.changeProfilePicture(token, file)
        if (response.success) {
            const nresponse = await AuthAPI.me(token)
            if (nresponse.success) {
                onDone(nresponse.data)
            }
        } else {
            onError(response.message)
        }
        setUploading(false)
    }

    return (
        <div>
            <FileUpload className="fileupload" accept="image/*" maxFileSize={5242880} uploadHandler={e => {
                uploadPicture(e.files[0])
            }} customUpload invalidFileSizeMessageDetail="La imagen no puede pesar más de 5MB" invalidFileSizeMessageSummary="Upss!" chooseLabel="Elegir" uploadLabel="Subir" cancelLabel="Cancelar" multiple={false}></FileUpload>
            <div style={{marginTop: 20, height: 20}}>
                {uploading && <ProgressBar color="#d78676" mode="indeterminate" />}
            </div>
        </div>
    )

}

export default UploadProfilePicture