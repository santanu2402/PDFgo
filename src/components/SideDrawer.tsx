import { View, Text } from 'react-native'
import React from 'react'
import { Drawer } from 'react-native-paper';
import { useStore } from '../store/store';

const SideDrawer = (props: any) => {

    const active = useStore((state: any) => state.active);
    const setActive = useStore((state: any) => state.setActive);

    return (
        <Drawer.Section style={{zIndex:100}} title="Menu">
            <Drawer.Item
                icon="watermark"
                label="Add Watermark"
                active={active === 'wtrmrk'}
                onPress={() => {
                    setActive('wtrmrk');
                    props.props.navigation.push('WatermarkScreen')
                }}
            />
            <Drawer.Item
                icon="lock-open"
                label="Decryption"
                active={active === 'dcrpdf'}
                onPress={() => {
                    setActive('dcrpdf');
                    props.props.navigation.push('DecryptPdfScreen')
                }}
            />
            <Drawer.Item
                icon="lock"
                label="Encryption"
                active={active === 'encrpdf'}
                onPress={() => {
                    setActive('encrpdf');
                    props.props.navigation.push('EncryptScreen')
                }}
            />
            <Drawer.Item
                icon="file-excel"
                label="Excel To PDF"
                active={active === 'exltopdf'}
                onPress={() => {
                    setActive('exltopdf');
                    props.props.navigation.push('ExcelToPdfScreen')
                }}
            />
            <Drawer.Item
                icon="image-plus"
                label="Image To PDF"
                active={active === 'imgtopdf'}
                onPress={() => {
                    setActive('imgtopdf');
                    props.props.navigation.push('ImageToPdfScreen')
                }}
            />
            <Drawer.Item
                icon="merge"
                label="Merge PDFs"
                active={active === 'mrgpdf'}
                onPress={() => {
                    setActive('mrgpdf');
                    props.props.navigation.push('MergePdfScreen')
                }}
            />
            <Drawer.Item
                icon="arrow-collapse-all"
                label="PDF Compressor"
                active={active === 'pdfcomp'}
                onPress={() => {
                    setActive('pdfcomp');
                    props.props.navigation.push('PdfCompressionScreen')
                }}
            />
            <Drawer.Item
                icon="file-eye"
                label="PDF Reader"
                active={active === 'pdfread'}
                onPress={() => {
                    setActive('pdfread');
                    props.props.navigation.push('OpenPdfScreen')
                }}
            />
            <Drawer.Item
                icon="file-pdf-box"
                label="PDF To Image"
                active={active === 'pdftoimg'}
                onPress={() => {
                    setActive('pdftoimg');
                    props.props.navigation.push('PdfToImageScreen')
                }}
            />
            <Drawer.Item
                icon="file-powerpoint"
                label="Powerpoint To PDF"
                active={active === 'ppttopdf'}
                onPress={() => {
                    setActive('ppttopdf');
                    props.props.navigation.push('PptToPdfScreen')
                }}
            />
            <Drawer.Item
                icon="format-page-split"
                label="Split PDF"
                active={active === 'pgsplit'}
                onPress={() => {
                    setActive('pgsplit');
                    props.props.navigation.push('SplitPdfScreen')
                }}
            />
            <Drawer.Item
                icon="file-word"
                label="Word To PDF"
                active={active === 'wrdtopdf'}
                onPress={() => {
                    setActive('wrdtopdf');
                    props.props.navigation.push('WordToPdfScreen')
                }}
            />
            <Drawer.Item
                icon="cloud-upload"
                label="PDF Cloud"
                active={active === 'cloud'}
                onPress={() => {
                    setActive('cloud');
                    props.props.navigation.push('DriveScreen')
                }}
            />
        </Drawer.Section>

    );
}

export default SideDrawer