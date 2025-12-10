import { useParams, useNavigate } from "react-router-dom";
import OrderTimeline from "./OrderTimeline";

function TrackOrderPage() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();

  if (!orderId) return null; // agar orderId missing hai to kuch render na kare

  return (
    <OrderTimeline
      orderId={orderId}
      onClose={() => navigate(-1)} // back kar de previous page pe
    />
  );
}

export default TrackOrderPage;
