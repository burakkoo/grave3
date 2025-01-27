// import NextAuth from 'next-auth';
// import authConfig from '@/auth.config';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import bcrypt from 'bcrypt';
// import prisma from '@/lib/prisma/prisma';
// import CredentialsProvider from 'next-auth/providers/credentials';
// import { createSendEmailCommand } from '@/lib/ses/createSendEmailCommand';
// //import { sesClient } from '@/lib/ses/sesClient';

// declare module 'next-auth' {
//   interface Credentials {
//     email: string;
//     password: string;
//   }
//   interface Session {
//     user: { id: string; name: string };
//   }
// }

// // Mock function to log email details during local development
// const mockSendVerificationRequest = async ({ identifier: email, url }) => {
//   console.log('Mock send email');
//   console.log(`To: ${email}`);
//   console.log(`Subject: Login To Memoria`);
//   console.log(`Body: <body>
//     <table width="100%" border="0" cellspacing="20" cellpadding="0"
//       style=" max-width: 600px; margin: auto; border-radius: 10px;">
//       <tr>
//         <td align="center"
//           style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif;">
//           Login to <strong>Memoria</strong>
//         </td>
//       </tr>
//       <tr>
//         <td align="center" style="padding: 20px 0;">
//           <table border="0" cellspacing="0" cellpadding="0">
//             <tr>
//               <td align="center" style="border-radius: 5px;" bgcolor="purple"><a href="${url}"
//                   target="_blank"
//                   style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: black; text-decoration: none; border-radius: 5px; padding: 10px 20px; display: inline-block; font-weight: bold;">Login</a></td>
//             </tr>
//           </table>
//         </td>
//       </tr>
//       <tr>
//         <td align="center"
//           style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif;">
//           If you did not request this email you can safely ignore it.
//         </td>
//       </tr>
//     </table>
//   </body>`);
// };

// export const {
//   auth,
//   handlers: { GET, POST },
//   signIn,
// } = NextAuth({
//   ...authConfig,
//   providers: [
//     ...authConfig.providers,
//     CredentialsProvider({
//       name: 'Credentials',
//       credentials: {
//         email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials, req) {
//         const { email, password } = credentials;

//         // Check if user exists
//         let user = await prisma.user.findUnique({
//           where: { email },
//         });

//         // If user does not exist, create them
//         if (!user) {
//           const hashedPassword = await bcrypt.hash(password, 10); // Hash the password

//           user = await prisma.user.create({
//             data: {
//               email,
//               password: hashedPassword,
//             },
//           });
//         }

//         // Validate the password if the user exists
//         const isValidPassword = await bcrypt.compare(password, user.password);
//         if (isValidPassword) {
//           return user;
//         } else {
//           return null;
//         }
//       },
//     }),
//     {
//       id: 'email',
//       type: 'email',
//       name: 'Email',
//       from: 'noreply@norcio.dev',
//       server: {},
//       maxAge: 24 * 60 * 60,
//       options: {},
//       async sendVerificationRequest({ identifier: email, url }) {
//         if (process.env.NODE_ENV === 'development') {
//           // Use the mock function in development
//           await mockSendVerificationRequest({ identifier: email, url });
//         } else {
//           // Use the actual SES function in production
//           const sendEmailCommand = createSendEmailCommand(
//             email,
//             'noreply@norcio.dev',
//             'Login To Memoria',
//             `<body>
//   <table width="100%" border="0" cellspacing="20" cellpadding="0"
//     style=" max-width: 600px; margin: auto; border-radius: 10px;">
//     <tr>
//       <td align="center"
//         style="padding: 10px 0px; font-size: 22px; font-family: Helvetica, Arial, sans-serif;">
//         Login to <strong>Memoria</strong>
//       </td>
//     </tr>
//     <tr>
//       <td align="center" style="padding: 20px 0;">
//         <table border="0" cellspacing="0" cellpadding="0">
//           <tr>
//             <td align="center" style="border-radius: 5px;" bgcolor="purple"><a href="${url}"
//                 target="_blank"
//                 style="font-size: 18px; font-family: Helvetica, Arial, sans-serif; color: black; text-decoration: none; border-radius: 5px; padding: 10px 20px; display: inline-block; font-weight: bold;">Login</a></td>
//           </tr>
//         </table>
//       </td>
//     </tr>
//     <tr>
//       <td align="center"
//         style="padding: 0px 0px 10px 0px; font-size: 16px; line-height: 22px; font-family: Helvetica, Arial, sans-serif;">
//         If you did not request this email you can safely ignore it.
//       </td>
//     </tr>
//   </table>
// </body>`,
//           );
//           //await sesClient.send(sendEmailCommand);
//         }
//       },
//     },
//   ],
//   adapter: PrismaAdapter(prisma),
//   session: {
//     strategy: 'jwt',
//   },
//   callbacks: {
//     ...authConfig.callbacks,
//     session({ token, user, ...rest }) {
//       return {
//         user: {
//           id: token.sub!,
//         },
//         expires: rest.session.expires,
//       };
//     },
//   },
// });
