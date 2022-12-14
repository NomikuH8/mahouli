import { EmailConfirmationPageContainer, ErrorMessageSpan, StyledEmailConfirmationForm } from "./styles";
import { sendEmailConfirm } from "../../api/userManager";
import { useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";

interface stateType {
	token: string
}

export function EmailConfirmationPage() {
	const [pendingUser, setPendingUser] = useState<any>({})
  const [wentWrong, setWentWrong] = useState<string>()
  const redirect = useNavigate()
	const state = useLocation().state as stateType

	useEffect(() => {
		setPendingUser(state.token)
		if (localStorage.getItem('token') ||
				!pendingUser)
			redirect('/')
	}, [])

  const onSubmit = async (e: React.SyntheticEvent ) => {
    e.preventDefault()
    
    const target = e.target as typeof e.target & {
      codeInput: { value: string }
    }

    const result = await sendEmailConfirm(target.codeInput.value, pendingUser, redirect)

    if (!result) {
      if (result.message === "wrong code")
        setWentWrong('Código Inválido')
    }
  }

  return(
    <EmailConfirmationPageContainer>
      <h1>Confirme o E-mail</h1>
      <StyledEmailConfirmationForm onSubmit={onSubmit}>
        <label htmlFor="codeInput">Insira o código de 8 dígitos</label>
        <input name="codeInput" type="text" maxLength={8} />
        <button type="submit">Entrar</button>
        <ErrorMessageSpan>{wentWrong}</ErrorMessageSpan>
      </StyledEmailConfirmationForm>
    </EmailConfirmationPageContainer>
  )
}