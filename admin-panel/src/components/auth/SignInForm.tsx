// import { useState } from 'react';
// import { EyeCloseIcon, EyeIcon } from '../../icons';
// import Label from '../form/Label';
// import Checkbox from '../form/input/Checkbox';
// import axios from '../../lib/axiosConfig';
// import { toast } from 'react-toastify';
// import { useAuth } from '../../context/AuthContext';
// import {
//   Box,
//   Button,
//   Divider,
//   Flex,
//   FormControl,
//   FormErrorMessage,
//   FormLabel,
//   HStack,
//   Heading,
//   Icon,
//   IconButton,
//   Input,
//   InputGroup,
//   InputRightElement,
//   Select,
//   Text,
//   useBoolean,
//   useColorModeValue,
// } from '@chakra-ui/react';
// import { type SubmitHandler, useForm } from 'react-hook-form';
// import { useTranslation } from 'react-i18next';
// import { FaGithub, FaLinkedin } from 'react-icons/fa';
// import { FcGoogle } from 'react-icons/fc';
// import { Link } from 'react-router-dom';
// import { useNavigate } from 'react-router-dom';
// import { emailPattern } from '@/utils/validateForm';

// export default function SignInForm() {
//   const { t } = useTranslation();
//   const { login } = useAuth();
//   const color = useColorModeValue('ui.dark', 'ui.light');
//   const navigate = useNavigate();
//   const [show, setShow] = useBoolean();
//   const [isChecked, setIsChecked] = useState(false);
//   type Account = {
//     username: string;
//     password: string;
//     type: string;
//   };
//   const [data, setData] = useState<Account>({
//     username: '',
//     password: '',
//     type: 'employee',
//   });

//   // const authLogin = async (e: React.FormEvent) => {
//   //   e.preventDefault();
//   //   if (!data.username) {
//   //     toast.error('Vui lòng nhập tên đăng nhập');
//   //     return;
//   //   }

//   //   if (!data.password) {
//   //     toast.error('Vui lòng nhập mật khẩu');
//   //     return;
//   //   }

//   //   try {
//   //     let res = await axios.post('/login', data);
//   //     login(res.data.user, res.data.token);
//   //     toast.success(res.data.message);
//   //     navigate('/');
//   //   } catch (err: any) {
//   //     if (err.response) {
//   //       const msg = err.response.data?.message || 'Đã có lỗi xảy ra';
//   //       toast.error(msg);
//   //       console.error('Lỗi server:', err.response);
//   //     } else {
//   //       toast.error('Không thể kết nối tới máy chủ');
//   //       console.error('Lỗi kết nối:', err);
//   //     }
//   //   } finally {
//   //   }
//   // };
//   const authLogin = async (data: Account) => {
//     try {
//       let res = await axios.post('/login', data);
//       login(res.data.user, res.data.token);
//       toast.success(res.data.message);
//       navigate('/');
//     } catch (err: any) {
//       if (err.response) {
//         const msg = err.response.data?.message || 'Đã có lỗi xảy ra';
//         toast.error(msg);
//         console.error('Lỗi server:', err.response);
//       } else {
//         toast.error('Không thể kết nối tới máy chủ');
//         console.error('Lỗi kết nối:', err);
//       }
//     } finally {
//     }
//   };
//   const onSubmit: SubmitHandler<Account> = async (data) => {
//     if (isSubmitting) return;
//     try {
//       await authLogin(data);
//     } catch {}
//   };
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm({
//     mode: 'onBlur',
//     criteriaMode: 'all',
//     defaultValues: {
//       username: '',
//       password: '',
//     },
//   });
//   return (
//     // <div className="flex flex-col flex-1">
//     //   {/* <div className="w-full max-w-md pt-10 mx-auto">
//     //             <Link
//     //                 to="/"
//     //                 className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
//     //             >
//     //                 <ChevronLeftIcon className="size-5" />
//     //                 Back to dashboard
//     //             </Link>
//     //         </div> */}
//     //   <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
//     //     <div>
//     //       <div className="mb-5 sm:mb-8">
//     //         <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
//     //           Sign In
//     //         </h1>
//     //       </div>
//     //       <div>
//     //         <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"></div>
//     //         <form onSubmit={authLogin}>
//     //           <div className="space-y-6">
//     //             <div>
//     //               <Label>
//     //                 Email <span className="text-error-500">*</span>{' '}
//     //               </Label>
//     //               <Input
//     //                 placeholder="info@gmail.com"
//     //                 onChange={(e) =>
//     //                   setData({
//     //                     ...data,
//     //                     username: e.target.value,
//     //                   })
//     //                 }
//     //               />
//     //             </div>
//     //             <div>
//     //               <Label>
//     //                 Password <span className="text-error-500">*</span>{' '}
//     //               </Label>
//     //               <div className="relative">
//     //                 <Input
//     //                   type={showPassword ? 'text' : 'password'}
//     //                   placeholder="Enter your password"
//     //                   onChange={(e) =>
//     //                     setData({
//     //                       ...data,
//     //                       password: e.target.value,
//     //                     })
//     //                   }
//     //                 />
//     //                 <span
//     //                   onClick={() => setShowPassword(!showPassword)}
//     //                   className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
//     //                 >
//     //                   {showPassword ? (
//     //                     <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//     //                   ) : (
//     //                     <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
//     //                   )}
//     //                 </span>
//     //               </div>
//     //             </div>
//     //             <div className="flex items-center justify-between">
//     //               <div className="flex items-center gap-3">
//     //                 <Checkbox checked={isChecked} onChange={setIsChecked} />
//     //                 <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
//     //                   Keep me logged in
//     //                 </span>
//     //               </div>
//     //               <Link
//     //                 to="/reset-password"
//     //                 className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
//     //               >
//     //                 Forgot password?
//     //               </Link>
//     //             </div>
//     //             <div>
//     //               <Button className="w-full" size="sm">
//     //                 Sign in
//     //               </Button>
//     //             </div>
//     //           </div>
//     //         </form>

//     //         <div className="mt-5">
//     //           <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
//     //             Don&apos;t have an account? {''}
//     //             <Link
//     //               to="/signup"
//     //               className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
//     //             >
//     //               Sign Up
//     //             </Link>
//     //           </p>
//     //         </div>
//     //       </div>
//     //     </div>
//     //   </div>
//     // </div>
//     <>
//       <Flex height="100vh" align="center" justify="center">
//         <Box
//           as="form"
//           onSubmit={handleSubmit(onSubmit)}
//           w={{ base: '100vw', md: '448px' }}
//           p={{ base: '4', md: '8' }}
//           textAlign="center"
//         >
//           <Heading mb={2}>WeWatch Admin</Heading>
//           <Text color={color} fontSize="2xl" fontWeight="bold" mb="4">
//             {t('page.login.login')}
//           </Text>

//           <FormControl id="username" isInvalid={!!errors.username}>
//             <FormLabel>
//               <Text color={color}>{t('page.login.email')}</Text>
//             </FormLabel>
//             <Input
//               color={color}
//               id="username"
//               {...register('username', {
//                 required: t('page.login.username_require_error'),
//                 pattern: emailPattern,
//               })}
//               placeholder={t('page.login.email_placeholder')}
//               type="email"
//               required
//             />
//             {errors.username && (
//               <FormErrorMessage>
//                 <Text>{t('page.login.invalid_email_error')}</Text>
//               </FormErrorMessage>
//             )}
//           </FormControl>

//           <FormControl id="password" isInvalid={!!error} mt="4">
//             <FormLabel>
//               <Text>{t('page.login.password')}</Text>
//             </FormLabel>
//             <InputGroup>
//               <Input
//                 color={color}
//                 {...register('password', {
//                   required: t('page.login.password_require_error'),
//                 })}
//                 type={show ? 'text' : 'password'}
//                 placeholder={t('page.login.password_placeholder')}
//                 required
//               />
//               <InputRightElement
//                 color="ui.dim"
//                 _hover={{
//                   cursor: 'pointer',
//                 }}
//               >
//                 <Icon
//                   as={show ? ViewOffIcon : ViewIcon}
//                   onClick={setShow.toggle}
//                   aria-label={show ? 'Hide password' : 'Show password'}
//                 >
//                   {show ? <ViewOffIcon /> : <ViewIcon />}
//                 </Icon>
//               </InputRightElement>
//             </InputGroup>
//             {error && <FormErrorMessage>{error}</FormErrorMessage>}
//           </FormControl>

//           <Button
//             variant="primary"
//             type="submit"
//             isLoading={isSubmitting}
//             w="full"
//             mt="4"
//             h="fit-content"
//           >
//             <Text py={3}>{t('page.login.login')}</Text>
//           </Button>
//           {/* <Link to="/recover-password">
//             <Text
//               mt="4"
//               _hover={{ cursor: "pointer", color: "blue.500" }}
//               color={color}
//             >
//               {t("page.login.forgot_password")}
//             </Text>
//           </Link> */}

//           <Button
//             variant="outline"
//             w="full"
//             mt="4"
//             leftIcon={<FcGoogle />}
//             onClick={() => onClickLoginWithSSO({ type: SSOProviders.GOOGLE })}
//             h="fit-content"
//           >
//             <Text py={3}>{t('page.login.login_google')}</Text>
//           </Button>

//           <Divider my="6" />

//           <Text mb="2" color={color}>
//             {t('page.login.use_other_methods')}
//           </Text>
//           <HStack justifyContent="center" spacing="4">
//             <IconButton
//               aria-label={t('page.login.login_linkedin')}
//               icon={<FaLinkedin />}
//               isRound
//               colorScheme="linkedin"
//               onClick={() =>
//                 onClickLoginWithSSO({ type: SSOProviders.LINKEDIN })
//               }
//             />
//             <IconButton
//               aria-label={t('page.login.login_github')}
//               icon={<FaGithub />}
//               isRound
//               colorScheme="gray"
//               onClick={() => onClickLoginWithSSO({ type: SSOProviders.GITHUB })}
//             />
//           </HStack>

//           {/* <Divider my="6" />

//           <Text color={color} mt="6">
//             {`${t("page.login.dont_have_an_account")} `}
//           </Text>
//           <Button
//             variant="primary"
//             onClick={() => navigate("/signup")}
//             w="full"
//             mt="2"
//             isDisabled // TODO: remove when handling first login
//           >
//             {t("page.login.signup")}
//           </Button> */}
//           <Flex justifyContent="space-around" alignItems="center" mt={4}>
//             <Flex justifyContent="start" alignItems="center" width="100%">
//               <Link to="/policy">
//                 <Text
//                   _hover={{ color: 'blue.500', textDecoration: 'underline' }}
//                 >
//                   {t('page.login.privacy_policy')}
//                 </Text>
//               </Link>
//             </Flex>
//             <Flex justifyContent="end" alignItems="center" width="100%">
//               <Select
//                 defaultValue={i18n.language}
//                 onChange={(e) => changeLanguage(e.target.value)}
//                 variant="flushed"
//                 width="fit-content"
//               >
//                 <option style={{ textAlign: 'center' }} value={'en'}>
//                   <Text color={color}>English</Text>
//                 </option>
//                 <option style={{ textAlign: 'center' }} value={'vi'}>
//                   <Text color={color}>Tiếng Việt</Text>
//                 </option>
//               </Select>
//             </Flex>
//           </Flex>
//         </Box>
//       </Flex>
//     </>
//   );
// }
import { useState } from 'react';
import { Link } from 'react-router';
import { EyeCloseIcon, EyeIcon } from '../../icons';
import Label from '../form/Label';
import Input from '../form/input/InputField';
import Checkbox from '../form/input/Checkbox';
import Button from '../ui/button/Button';
import axios from '../../lib/axiosConfig';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function SignInForm() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  type Account = {
    username: string;
    password: string;
    type: string;
  };
  const [data, setData] = useState<Account>({
    username: '',
    password: '',
    type: 'employee',
  });

  const authLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!data.username) {
      toast.error('Vui lòng nhập tên đăng nhập');
      return;
    }

    if (!data.password) {
      toast.error('Vui lòng nhập mật khẩu');
      return;
    }

    try {
      let res = await axios.post('/login', data);
      login(res.data.user, res.data.token);
      toast.success(res.data.message);
      navigate('/');
    } catch (err: any) {
      if (err.response) {
        const msg = err.response.data?.message || 'Đã có lỗi xảy ra';
        toast.error(msg);
        console.error('Lỗi server:', err.response);
      } else {
        toast.error('Không thể kết nối tới máy chủ');
        console.error('Lỗi kết nối:', err);
      }
    } finally {
    }
  };
  return (
    <div className="flex flex-col flex-1">
      {/* <div className="w-full max-w-md pt-10 mx-auto">
                <Link
                    to="/"
                    className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                    <ChevronLeftIcon className="size-5" />
                    Back to dashboard
                </Link>
            </div> */}
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Sign In
            </h1>
          </div>
          <div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-5"></div>
            <form onSubmit={authLogin}>
              <div className="space-y-6">
                <div>
                  <Label>
                    Email <span className="text-error-500">*</span>{' '}
                  </Label>
                  <Input
                    placeholder="info@gmail.com"
                    onChange={(e) =>
                      setData({
                        ...data,
                        username: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <Label>
                    Password <span className="text-error-500">*</span>{' '}
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      onChange={(e) =>
                        setData({
                          ...data,
                          password: e.target.value,
                        })
                      }
                    />
                    <span
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                    >
                      {showPassword ? (
                        <EyeIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      ) : (
                        <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400 size-5" />
                      )}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox checked={isChecked} onChange={setIsChecked} />
                    <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                      Keep me logged in
                    </span>
                  </div>
                  <Link
                    to="/reset-password"
                    className="text-sm text-brand-500 hover:text-brand-600 dark:text-brand-400"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div>
                  <Button className="w-full" size="sm">
                    Sign in
                  </Button>
                </div>
              </div>
            </form>

            <div className="mt-5">
              <p className="text-sm font-normal text-center text-gray-700 dark:text-gray-400 sm:text-start">
                Don&apos;t have an account? {''}
                <Link
                  to="/signup"
                  className="text-brand-500 hover:text-brand-600 dark:text-brand-400"
                >
                  Sign Up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
