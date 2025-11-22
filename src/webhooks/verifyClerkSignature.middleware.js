import crypto from 'crypto';

export const verifyClerkSignature = (req, res, next) => {
    const svixId = req.headers['svix-id'];
    const svixTimestamp = req.headers['svix-timestamp'];
    const svixSignature = req.headers['svix-signature'];
    const clerkWebhookSecret = process.env.CLERK_WEBHOOK_SECRET;

    if (!svixId || !svixTimestamp || !svixSignature || !clerkWebhookSecret) {
        return res.badRequest({ error: 'Missing required Svix headers or webhook secret' });
    }

    // Verify timestamp to prevent replay attacks (tolerance: 5 minutes)
    const timestamp = parseInt(svixTimestamp, 10);
    const currentTime = Math.floor(Date.now() / 1000);
    const timestampTolerance = 5 * 60; // 5 minutes in seconds

    if (Math.abs(currentTime - timestamp) > timestampTolerance) {
        return res.badRequest({ error: 'Timestamp too old or too far in the future' });
    }

    // Construct the signed content: {id}.{timestamp}.{body}
    const body = JSON.stringify(req.body);
    const signedContent = `${svixId}.${svixTimestamp}.${body}`;

    // Extract the secret (remove 'whsec_' prefix and base64 decode)
    const secretParts = clerkWebhookSecret.split('_');
    if (secretParts.length < 2 || secretParts[0] !== 'whsec') {
        return res.badRequest({ error: 'Invalid webhook secret format' });
    }
    
    const secretBytes = Buffer.from(secretParts[1], 'base64');

    // Calculate the expected signature
    const expectedSignature = crypto
        .createHmac('sha256', secretBytes)
        .update(signedContent)
        .digest('base64');

    // Parse the signature header (format: "v1,signature v1,signature2 ...")
    const signatures = svixSignature.split(' ').map(sig => {
        const parts = sig.split(',');
        return parts.length === 2 ? parts[1] : null;
    }).filter(sig => sig !== null);

    // Use constant-time comparison to prevent timing attacks
    let isValid = false;
    for (const signature of signatures) {
        try {
            if (crypto.timingSafeEqual(
                Buffer.from(expectedSignature),
                Buffer.from(signature)
            )) {
                isValid = true;
                break;
            }
        } catch (e) {
            // Signatures may have different lengths, continue checking
            continue;
        }
    }
    
    if (!isValid) {
        return res.badRequest({ error: 'Invalid webhook signature' });
    }

    next();
}

export default verifyClerkSignature;