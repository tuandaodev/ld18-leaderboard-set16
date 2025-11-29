// libraries
import {
    Button,
    Col,
    Input,
    Row,
} from "antd";
import { lazy, useEffect, useState } from 'react';
//style
import 'react-quill/dist/quill.snow.css';

//manual
import { RICH_TEXT_FORMATS, RICH_TEXT_MODULES } from "@lib/constants";
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
    valueType?: string | undefined
};

const ReactQuill = lazy(() => import('react-quill'));


export default function TextInputControl({
    isMedium,
    setModalData,
    setModalFunction,
    setModal2Open,
    modifyContentConfig,
    data,
    langCode,
    valueType
}: Props) {

    const [value, setValue] = useState<string>('');
    useEffect(() => {
        const value = data?.translate.find((item) => item.lang === langCode);
        setValue(value?.value || '');
    }, [data, langCode, valueType])

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
                    <div
                        className="richTextWrapper"
                    >
                        <Input type={valueType ?? 'text'} value={value} onChange={($event: any) => {
                            setValue($event.target.value)
                        }} />
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
                                                modifyContentConfig(data?.contentId!, langCode, value, null)
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
