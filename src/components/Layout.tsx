import React, {useState} from "react";
import Link from "next/link";
import {useWalletStore} from "src/store";

import {web3Accounts, web3Enable} from "@polkadot/extension-dapp";
import {InjectedAccountWithMeta} from "@polkadot/extension-inject/types";

import {Button} from "react-daisyui";

import {useRouter} from "next/router";
import {trimUndefinedProperties} from "twitter-api-v2/dist/helpers";

type LayoutProps = {
  children?: React.ReactNode;
};

const Layout = ({children}: LayoutProps) => {
  const {account, setAccount} = useWalletStore(state => ({
    account: state.account,
    setAccount: state.setAccount,
  }));

  const router = useRouter();

  const [walletAuthorized, setWalletAuthorized] = useState(false);
  const [accounts, setAccounts] = useState<InjectedAccountWithMeta[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<InjectedAccountWithMeta | null>(null);

  const getAccounts = async () => {
    const extensions = await web3Enable("Perma-Tweeter dapp");
    if (extensions.length === 0) {
      return;
    }
    setWalletAuthorized(true);
    const allAccounts = await web3Accounts();
    setAccounts(allAccounts);
    setSelectedAccount(allAccounts[0]);
    setAccount(allAccounts[0]);
  };

  const handleConnect = () => {
    getAccounts();
  };

  const handleChangeAccount = (event: React.MouseEvent<HTMLButtonElement>) => {
    const target = event.target as HTMLButtonElement;
    const address = target.value;

    const found = accounts.find(account => account.address === address);

    setSelectedAccount(found!);
    setAccount(found!);
  };

  const trimMiddleString = (text?: string, numberStringsKept = 5) => {
    if (!text) return "";
    const temp = `${text.slice(0, numberStringsKept)}...${text.slice(
      text.length - numberStringsKept,
    )}`;

    return temp;
  };

  return (
    <>
      <header className="sticky top-0 z-30 shadow-xl p-4 backdrop-filter backdrop-blur-xl bg-slate-100 text-grey-600">
        <div className="flex justify-between items-center h-16 md:justify-center">
          <div className="text-primary text-2xl font-normal">Perma-Tweeter</div>
          <ul className="items-stretch hidden space-x-3 mx-auto md:flex">
            <li className="flex">
              <Link
                href="/tweets"
                legacyBehavior
                className="flex items-center px-4 py-4 -mb-1 border-b-2 dark:border-transparent">
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className={`flex items-center px-4 py-4 -mb-1 border-b-2 border-transparent ${
                    router.pathname === "/tweets" ? "text-primary border-primary" : ""
                  }`}>
                  Feeds
                </a>
              </Link>
            </li>
            <li className="flex">
              <Link href="/crosspost" legacyBehavior>
                <a
                  rel="noopener noreferrer"
                  href="#"
                  className={`flex items-center px-4 -mb-1 border-b-2 border-transparent ${
                    router.pathname === "/crosspost" ? "text-primary border-primary" : ""
                  }`}>
                  Cross-post a tweet
                </a>
              </Link>
            </li>
          </ul>
          {walletAuthorized && accounts.length ? (
            <div className="group inline-block relative">
              <Button
                className="normal-case"
                variant="outline"
                color="primary"
                id="connect-button-with-address">
                <span className="mr-1">{trimMiddleString(selectedAccount?.address)}</span>
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />{" "}
                </svg>
              </Button>
              <ul className="absolute hidden text-white pt-1 group-hover:block">
                {accounts.map(({address}) => (
                  <li
                    key={address}
                    className="first:rounded-t last:rounded-b bg-primary hover:bg-gray-500">
                    <button
                      className="py-2 px-4 block whitespace-no-wrap"
                      value={address}
                      onClick={handleChangeAccount}>
                      {trimMiddleString(address)}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <Button
              id="connect-button"
              onClick={handleConnect}
              className="normal-case"
              color="primary"
              variant="outline">
              Connect Polkadot.js
            </Button>
          )}
        </div>
      </header>
      <main className="bg-gray-100">{children}</main>
    </>
  );
};

export default Layout;