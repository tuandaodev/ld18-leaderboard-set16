// libraries
import {
    Button,
    Col,
    GetProp,
    message,
    Row,
    Upload,
    UploadProps,
} from "antd";
import { lazy, useEffect, useState } from 'react';
//style
import 'react-quill/dist/quill.snow.css';

//manual
import { UploadOutlined } from "@ant-design/icons";
import { UploadChangeParam } from "antd/es/upload";
import { t } from "i18next";
import { ContentItem } from "types/endpoints/current-week";

type Props = {
    setModalData: React.Dispatch<React.SetStateAction<JSX.Element | null>>
    setModalFunction: React.Dispatch<React.SetStateAction<JSX.Element | null>>
    setModal2Open: React.Dispatch<React.SetStateAction<boolean>>
    isMedium: boolean,
    modifyContentConfig: (
        contentId: string,
        langCode: string,
        value: string | null,
        image: File | null
    ) => Promise<void>;
    data: ContentItem | undefined,
    langCode: string,
};

const ReactQuill = lazy(() => import('react-quill'));
type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const domain = import.meta.env.DEV
  ? import.meta.env.VITE_DEV_DOMAIN! || ""
  : import.meta.env.VITE_PRO_DOMAIN! || "";

export default function ImageControl({
    isMedium,
    setModalData,
    setModalFunction,
    setModal2Open,
    modifyContentConfig,
    data,
    langCode
}: Props) {

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [value, setValue] = useState<string>('');
    const [image, setImage] = useState<string>('');
    useEffect(() => {
        const value = data?.translate.find((item) => item.lang === langCode);
        setValue(value?.value || '');
        setImage(value?.image || '');
    }, [data, langCode])

    const handleFileChange = (info: UploadChangeParam<any>) => {
        if (info.file) {
            setSelectedFile(info.file as File);
        }
    };

    const beforeUpload = (file: FileType) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/jpg';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return false;
    };

    return (
        <>
            <Row>
                <Col span={24}
                    style={{
                        display: 'flex',
                        justifyContent: 'start',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '18px'
                    }}
                >{t("Cập nhật") } { data?.description }</Col>
                <Col span={24}>
                    <div>
                    {image && (
                        <img
                        src={`${domain}${image}`}
                        alt="Image"
                        style={{ width: '100px', height: '100px', marginTop: '10px' }}
                        />
                    )}
                    </div>
                    <div
                        className=""
                    >

                        <Upload
                            beforeUpload={beforeUpload}
                            onChange={handleFileChange}
                        >
                            <Button icon={<UploadOutlined />}>Select File</Button>
                        </Upload>
                    </div>
                </Col>
                <Col span={24}
                    style={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'center',
                        marginTop: '10px'
                    }}>
<Button
                            size={isMedium ? 'middle' : 'large'}
                            type="primary"
                            onClick={() => {
                                setModalData(
                                    <>
                                        <p>Bạn có chắc muốn lưu nội dung này không?</p>
                                    </>
                                )
                                setModalFunction(
                                    <>
                                        <Button
                                            onClick={() => {
                                                modifyContentConfig(data?.contentId!, langCode, value, selectedFile)
                                                setModalData(null)
                                                setModal2Open(false)
                                            }}
                                            type="primary"
                                        >Đồng ý
                                        </Button>
                                    </>
                                )
                                setModal2Open(true)
                            }}
                        >
                            { t("Lưu") }
                        </Button>

                    </Col>
            </Row>
        </>
    );
}
