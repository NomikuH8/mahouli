import { SigninPageContainer, StyledSigninForm } from "./styles";
import { sendLogin } from "../../api/userManager";
import { useNavigate } from "react-router";
import { useState } from "react";

export function SigninPage() {
	const [wentWrong, setWentWrong] = useState<string>()
  const redirect = useNavigate()

  const onSubmit = async (e: React.SyntheticEvent ) => {
    e.preventDefault()
    
    const target = e.target as typeof e.target & {
      email: { value: string }
      password: { value: string }
    }

    const result = await sendLogin(target.email.value, target.password.value)

		if (result) {
			if (result.message === 'email not confirmed')
				redirect('/email-confirmation')
			return
		}

    redirect('/')
  }

  return(
    <SigninPageContainer>
      <h1>Login</h1>
      <StyledSigninForm onSubmit={onSubmit}>
        <label htmlFor="emailInput">Email:</label>
        <input id="emailInput" name="email" type="email" autoComplete="on"/>
        <label htmlFor="passwordInput">Senha:</label>
        <input id="passwordInput" name="password" type="password" />
        <button type="submit">Entrar</button>
      </StyledSigninForm>
    </SigninPageContainer>
  )
}