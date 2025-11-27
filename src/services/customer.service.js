import Stripe from "stripe"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const CustomerService = {
    async create(data) {
        const customer = await stripe.customers.create({
            email: data.email,
            name: data.name,
        });
        return customer;
    },
}

export default CustomerService;