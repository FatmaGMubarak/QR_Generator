import QRCode from "react-qr-code";
export default function QrCard({endodedData}) {
  return (
    <div id="qr-code">
            <QRCode value={endodedData} size={200}/>
    </div>
  )
}
