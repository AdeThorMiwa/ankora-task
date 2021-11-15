export const USER_NOTIFY_EMAIL = `

<h2> Hello {{email}},</h2>

<p>Your file has been successfully uploaded</p>
<p>{{count}} rows were inserted</p>

GOTO <b style="font-size: 32px">{{link}}</b> to access it

`;

export const USER_NOTIFY_EMAIL_FAIL = `

<h2> Hello {{email}},</h2>

<p>Your file upload failed</p>

<code>
{{reason}}
</code>

GOTO <b style="font-size: 32px">{{link}}</b> to retry it

`;
