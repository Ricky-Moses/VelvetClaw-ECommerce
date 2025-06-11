
const Loading = () => {
  return (
    <div className="w-dvw h-dvh flex flex-col items-center justify-center">
        <h1 className="text-5xl xs:text-7xl small-caps text-main-theme font-bold">VelvetClaw</h1>
        <progress className="progress w-46 xs:w-56 text-main-theme"></progress>
    </div>
  )
}

export default Loading