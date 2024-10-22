// import { Cookies } from 'react-cookie'
import { get } from './fetcher'
import {
    MeetingFileType,
    MeetingFileTypeToFolderName,
} from '@/constants/meeting'
import { IUploadResponse } from './response.type'
import axios from 'axios'
import {
    AccountFileType,
    AvatarFileTypeToFolderName,
} from '@/constants/account'
import { FolderType } from '@/constants/s3'
// const cookies = new Cookies()

const serviceUpload = {
    getPresignedUrl: async (
        folderType: FolderType,
        subFolder: string,
        files: File[],
        fileType: MeetingFileType,
    ): Promise<IUploadResponse> => {
        const response: { data: IUploadResponse } = await get('/s3', {
            meetingFiles: files.map((file) => ({
                folderType: folderType,
                subFolder: subFolder + '/',
                fileName: file.name,
                fileType: MeetingFileTypeToFolderName[fileType],
            })),
        })
        return response.data
    },

    getPresignedUrlAvatar: async (
        folderType: FolderType,
        files: File[],
        fileType: AccountFileType,
    ): Promise<IUploadResponse> => {
        const response: { data: IUploadResponse } = await get('/s3', {
            meetingFiles: files.map((file) => ({
                folderType: folderType,
                subFolder: '',
                fileName: file.name,
                fileType: AvatarFileTypeToFolderName[fileType],
            })),
        })
        return response.data
    },

    uploadFile: async (file: File, uploadUrl: string) => {
        const headers = {
            'Content-Type': file.type,
        }

        const axiosInstance = axios.create()
        const response = await axiosInstance.request({
            method: 'PUT',
            data: file,
            url: uploadUrl,
            headers,
        })

        return response.data
    },

}

export default serviceUpload
