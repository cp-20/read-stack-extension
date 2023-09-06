import { useAuth } from "@/lib/auth"
import { css } from "@emotion/react"
import { Button, useMantineTheme } from "@mantine/core"
import { IconBrandGithubFilled } from "@tabler/icons-react"
import brandIcon from "data-base64:assets/icon.svg"
import type { FC } from "react"

export const Popup: FC = () => {
  const { user, login } = useAuth()

  return (
    <>
      <div
        css={css`
          width: 480px;
          padding: 32px;
          display: flex;
          min-height: 100vh;
          flex-direction: column;
          gap: 32px;
        `}>
        <div
          css={css`
            display: flex;
            flex: 1;
            align-items: center;
            justify-content: center;
            gap: 32px;
          `}>
          <div>
            <img src={brandIcon} alt="" width={96} height={96} />
          </div>
          <div>
            <h1
              css={css`
                font-size: 2rem;
                font-family: "Raleway", sans-serif;
                margin: 0;
              `}>
              ReadStack
            </h1>
            <p
              css={css`
                font-size: 1rem;
                margin: 0;
              `}>
              技術記事の未読消化をサポート
            </p>
          </div>
        </div>
        {user || (
          <Button
            color="dark"
            leftIcon={<IconBrandGithubFilled color="white" />}
            onClick={login}>
            GitHubでログイン
          </Button>
        )}
      </div>
    </>
  )
}
