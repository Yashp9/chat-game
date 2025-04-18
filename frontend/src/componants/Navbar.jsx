import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LogOut, MessageSquare, Settings, User } from "lucide-react";
import { useThemeStore } from "../store/useThemeStore";
import { usePlayStore } from "../store/usePlayStore";

const Navbar = () => {
  const { logout, authUser, socket } = useAuthStore();
  const { theme } = useThemeStore();
  const {setRoomId} = usePlayStore();

  useEffect(() => {
    if(!socket) return //if socket is not ready , skip.
    // Start game: join the room
    const handleStartGame = ({ roomId }) => {
      socket.emit("join_game_room", roomId);
      setRoomId(roomId);
    };

    socket.on("start_game", handleStartGame);

    return () => {
      socket.off("start_game", handleStartGame);
    };
  },[socket]);

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                {theme === "dark" ? (
                  <img
                    src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKl0lEQVR4nN1bDXRUxRUe1OzMBuTPKnkvUI+25WirVrStPT39UfS0VotWaqQeSPA30kCy984kylFg24N/VSj2+IOIP1Cr9QeKVgRBASkq1YOColhbNBreS0zezG5Qiyg/r+e+fRvCZjeQABs33zlz9u2+efPu3Lkz9843dxnrCfiVRVGNP4jq2OiokWVRr+b7zI8fwXo7jtw68Shh4M9coxYG/faFa0xyDTMGtE4exHojuCfP5hqM0PglNzCfRr/I1JxUZOA7dM01/jW81xRpqfkW603gBs8VGrdzjesjOnZirnpFiZpThIHPuYaHWTI2kPUGiETN18nkucHXWeK6Afusb+DOcFr8j3swkhU6uIH5wsBnvBWO399nilvgNGFwk9CwmTVglBUqohpLhYYdXOPtHW6Sifvxw7I+6FcW0TRIWYKUrFDBDVRSJyKePIE6S64v+N2DkeGCt1YYOSbiwYXcwHSu8VGu4TZuYr8QGnYFCtBYzwoVwsBD3IDLfNYnPaKRBIziBhuFxve5wS1trlDDF1Q3vN5B39P3CtYrCA1Lg1HWWNHWUQ+SxS2Q4K2136Dgh9xgcTJ2KquPCwqIgpigTRH4Nn1GdewMVogQBldwja8ID/6VVsCgJmjFBXhltvpRXT1UaNzNNb4UBEsJGJsKkuAcVojgGh6j0Yxq2HbGelx3xbNy4RtSTt06Hn+Y6xlh8Dph4JOUJeBC+ixOyhGsECEM1tGIUicuWoXPJcuVotKZAgL48SOEhrfCabCbNVf1Y4UIYaA2bfoXrWingLH7UEBgPfhSqIAvIy1yOCtEcAPN3GAw/0evlEu7pgB4WRh4T2hoFRrnskKE0Pi+MPBudxXANTQIA9u4gVmsEMG92JnC4L9JAb9Z0VUF4CtBPGBwWd+Pa4awQkZUw2fnrMXVaQUkx6oz9/WMMPgfrvFx1hsgNLx23GasTyugtbyurLP6/T6pPlpo3Ck0TGW9AcLAteTO7r9DzQqUME6hPzbeP2d9DVOpPkWJrFdAV/cXBptLP0T3nUnyelJCYqy8IFvVqAffSy18+CTrTYhqvIgWw6EfoPvYrfK2QAkV6qc+Y3321IGLA7dHUWBSHcd6EyItcng6KCr2YNfJ7+CmMS/g4tEr4T77w9gdRJelmSD6LPiVPxMioY6ljl26HJ45bw2uOGZLO2aYSBMDa7mBq9IcAlFpzK/m+0OjFQQinryAOnbbXDk77Q3mz5g4nFijoKMhRAJ+EirmrpBFpr3ECmKOiVdgBQc/fljACht0S7ZAc/MVWBcqYHTu+vBqmg0KPcL7oaU8w/x4hBUCIp48gRu4MerhRyQ8dX7BLfLWRLkanyyXI/yyssNzPqtjJ4YKmNamFA8mhtag2FcWydhArnESBT4Bk+PhzpM24abqhfBQ/YTYL3UFlu5PM1zjlSkeIHZqx/0BrmZfOdTHBZGaUY2fkuDD6mHLuGXyqaXx2suS49RxPvO7NHdpzgsD/83y+7Jwwbz5KzMVilvAEh6uJ/Mk1mfeTJyZrFCXt4wFqzvtBeafMvW6zHtEpgZUWYo2+ydzK4tZj0JX949qfPfIFtg2/SGcm4rwcJw/Pi6626TQOJuO0fp9Ir/W4YyBAqQEVgkTuzTNHdKBK+spcIPzij3YccccdVdqk6Oqmsu6T18FsYLG7eQCO9wzUqbiA3Vs8G4Nj4QM8jo6SGH5RnFSjqBRGLUan0/79URF7SkH4RhtW9Srszvco0hRw4Y93+VlbUfrBqazfENonN2vBbdvrJY3pEd/1c+6n+QQBEAadgULXAaIFg9Z4qvbfgsjRq5hDYXPec8riBrc/N2NuHEP06vO73Zj9XERUGc5DkOpk8EJU7t7QsN9XINHW2ayxKhGYHmDX1lELyWm11TI2uXT5PT9oblygToTjL4nz+5wz8AlqZGOXZHxzAah4dnw+oO8skdHBqku6I9/Vv79pgfVHFLGXffiud1pixu8Jtc8prWARpkbfI357SLHxHUDwvPDOH2lEDnIP+gJBSz5Pd502ptyw+pr5Y+62k7Ui/06pL6e2auDBD9+mDDwgjD4aebhqPCgPHVmGJ42G1hAByksXxjQOnkQCTDuOXxqD9FZd1pX2ghMm06ENbycLaARGqeEyVOXZ48IsT69O8y7AliK4iIFPP3wDDnjKBe2zvtT7c/pFiU+cY235HzWZ31EAibTyHMNL1JbmVVovgeBjoH5OSNFDde31c+7AppU3zS5Me0v+ABdwxOqvI0ANehnW82Lm2tLhIGnw5F9NFudPdMCl2QLcLiGv5Hbax8p5l8BDRilTox5QS7+w3ycS9cTF6ZMNXW6m6GAIOUFJwUEh4FtEY012ZqlTJEwSyz7tAhihWD0g8Wv5xTgxyPUyYtX4JLAC5ACFsFVHRTQpPqm9vGwOYzans+V7UFKCaaFgbXZgppg3dHwAZVMy+kBBZQdnj7v++P98l66rlqE17RXQGiqwfaYjrko76cTBmhW6AoXZM0KI4VrXEL7hCCtNgM9oADWhwS+cBUumzkH76HraxarqgwFeELDvWlXlQ3CyGHCwMqw/oysWWM03VKd350ZDPWcAlgQfOy6YDUun3Uf3E0duGoxVO81BfaR1EBnAFxDQhjcSn49V+YoBTgpj5G98z2mgKgHXxC9TSkvp2/A9YtuVKNyLoIdBZ7VNjVyJFASRZ7KHMPGSAI63Wdwg4tot8jyiagHZuSruKYtEKqoO4t+J9IyUEAnub7C4AMB4dlJirzQ8gahcU7/Vhy8L1konqCpxPKJYg3vUQjcxgWUy18Fwhi8mhRAAVG+ZAmoMoPzWD4hNP5jWD04exSQCoS4h2cFyY0Gz8uHHJRvmKbKWD4hNEyNerDrTaybklKClH51NSfTT+UHw4z8yIFTUmm1chjLF2L1xw4c7v125AA90Z+wpGrRh7EJU6isu3ncGZM/+vqgwfp3awbqqsaJzglH0fe4z/Zyb/Sdfj/Qcn7DyNKBuqp5sK5aSTId0k5jw9CTlWs9IR37M+XafteK9UD7tqRrPdj1NvZdSDbpWo+rpiEHd/2Rjj1GudZ26VpaOvad0rWqVaNVub8FmobslelB37vyfFtxrXukY+8IlUryPJmWhT5D2TTdU459yUHpfK1jnypd6wvpWqvI7FgPIP72tyPKtW5Xjr1TOXaLdK3rqxtLjs5WFxuGDlaO/SIpgaz2gF+uHHsRvfSQz7EcoPdKx35JOfZusoD9kSNUgicde+EBvbxy3elF0rU+V641k/UAVNOQvtKxXw/M3SntNLMsE9KxZynX2hb3Wff/j1jbfHQJzTfcUhLs9PIN6diPkNljY0mXCVfl2BNIdupDtwWIu1ZxYHqOPYXlGcqxVbCyu9bkbj4/TTr2LmwYemB/upKO/ZpyrbcyffmhhNpSijTy0rXmdScthmSVjr1RudbaAxZGOqVlgdtx7NxE50GCarROV469PHRzT9Pq3512pGPfGrTRWJI9DafLDbrW7FAJS5Vjj5KOPRw+Pub4Ay3SsUeQkLTIKtd6I3zHTvLn2DD0m11sazjJphz7uXDq3M0OGnzWR7nWJHIthyKCO6iFZHTsQ7Mxqky5xR+rxpLybkVyh7SUlJNsJGNXOvV/S8ZeVyvQO6UAAAAASUVORK5CYII="
                    alt="external-monk-buddhism-icongeek26-outline-colour-icongeek26"
                  />
                ) : (
                  <img
                    src="data:image/png;base64,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"
                    alt="external-monk-buddhism-icongeek26-outline-colour-icongeek26"
                  />
                )}
              </div>
              <h1 className="text-lg font-bold">Monk-Chat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={"/settings"}
              className={`
                    btn btn-sm gap-2 transition-colors
                    
                    `}
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Settings</span>
            </Link>

            {authUser && (
              <>
                <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                  <User className="size-5" />
                  <span className="hidden sm:inline">Profile</span>
                </Link>

                <button className="flex gap-2 items-center" onClick={logout}>
                  <LogOut className="size-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
