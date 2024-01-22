/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

export const bookTour = async (tourId) => {
    console.log('Ok');
    const stripe = Stripe(
        'pk_test_51OYNMvHDcMNy1ETb38UJvVZ0E2BDIXfv6cF8YCLksfmQGCtJyMupzC3eDKsWTrztYGHsJ1FlJXv4qT95uTsTYRRn003sLegyU9',
    );
    try {
        // 1) Get checkout session from API
        const session = await axios(
            `/api/v1/bookings/checkout-session/${tourId}`,
        );
        console.log(session);

        // 2) Create checkout form + charge credit card
        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert('error', err);
    }
};
