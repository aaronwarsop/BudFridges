const DeliveryReport = () => {
    const [deliveryId, setDeliveryId] = useState('');
    const [driverId, setDriverId] = useState('');
    const [status, setStatus] = useState('');
    const [comments, setComments] = useState('');
    const [responseMessage, setResponseMessage] = useState('');
  
    const handleReportDelivery = async () => {
      try {
        const response = await axios.post('http://localhost:5000/delivery-report', {
          deliveryId,
          driverId,
          status,
          comments
        });
        setResponseMessage(response.data);
      } catch (error) {
        setResponseMessage('Error reporting delivery');
        console.error('Error reporting delivery:', error);
      }
    };
  
    return (
      <div>
        <h2>Delivery Report</h2>
        <label>
          Delivery ID:
          <input type="text" value={deliveryId} onChange={(e) => setDeliveryId(e.target.value)} />
        </label>
        <label>
          Driver ID:
          <input type="text" value={driverId} onChange={(e) => setDriverId(e.target.value)} />
        </label>
        <label>
          Status:
          <input type="text" value={status} onChange={(e) => setStatus(e.target.value)} />
        </label>
        <label>
          Comments:
          <input type="text" value={comments} onChange={(e) => setComments(e.target.value)} />
        </label>
        <button onClick={handleReportDelivery}>Report Delivery</button>
        {responseMessage && <div>{responseMessage}</div>}
      </div>
    );
  };
  
  export default DeliveryReport;
  