function toE164(phone) {
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 10) return `+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `+${digits}`;
  return `+${digits}`;
}

export async function sendVerificationSms(phone, code) {
  const body = `Your Linden Sports Bar verification code is: ${code}. It expires in 10 minutes.`;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_PHONE_NUMBER;

  if (sid && token && from) {
    const params = new URLSearchParams({
      To: toE164(phone),
      From: from,
      Body: body,
    });

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${sid}/Messages.json`,
      {
        method: 'POST',
        headers: {
          Authorization: `Basic ${Buffer.from(`${sid}:${token}`).toString('base64')}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to send verification text. Please try again.');
    }

    return { sent: true, devMode: false };
  }

  if (process.env.NODE_ENV !== 'production') {
    console.log(`[SMS DEV] To ${phone}: ${body}`);
    return { sent: true, devMode: true, devCode: code };
  }

  throw new Error('SMS verification is not configured. Contact the restaurant.');
}
