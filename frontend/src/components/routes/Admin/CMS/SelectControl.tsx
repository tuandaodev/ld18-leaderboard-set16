// libraries
import {
    Button,
    Col,
    Row,
    Select,
} from "antd";
import { useEffect, useState } from 'react';

//manual
import { t } from "i18next";
import { ContentItem } from "types/endpoints/content";

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

export default function SelectControl({
    isMedium,
    setModalData,
    setModalFunction,
    setModal2Open,
    modifyContentConfig,
    data,
    langCode
}: Props) {

    const [value, setValue] = useState<string>('');
    useEffect(() => {
        const translateItem = data?.translate.find((item) => item.lang === langCode);
        setValue(translateItem?.value || '');
    }, [data, langCode])

    // Get options from meta field, fallback to empty array if not available
    const selectOptions = data?.meta?.[0]?.options || [];

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
                        <Select
                            style={{ width: '100%' }}
                            value={value || undefined}
                            onChange={(selectedValue) => {
                                setValue(selectedValue);
                            }}
                            options={selectOptions}
                            placeholder="Select a value"
                        />
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

