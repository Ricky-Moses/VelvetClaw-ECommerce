import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js'

const PayPalButton = ({ amount, onSuccess, onError }) => {
    return (
        <PayPalScriptProvider options={{
            clientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
            currency: "USD"
        }}>
            <PayPalButtons
                style={{ layout: "vertical" }}
                createOrder={(data, action) => {
                    return action.order.create({
                        purchase_units: [{ amount: { value: parseFloat(amount).toFixed(2) } }]
                    })
                }}
                onApprove={(data, action) => {
                    return action.order.capture().then(onSuccess)
                }}
                onError={onError}
            />
        </PayPalScriptProvider>
    )
}

export default PayPalButton