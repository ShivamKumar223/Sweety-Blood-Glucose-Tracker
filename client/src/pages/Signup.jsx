export const SignupPage = ()=>{

    return <div className="container flex-center">
          <form action="">
            <h1>Sign-up</h1>
            <input className="input" type="text" placeholder="Enter name"/>
            <input className="input" type="text" placeholder="Enter email"/>
            <input type="text" placeholder="Enter password"/>
            <input type="text" placeholder="Re-enter password"/>
            <button type="submit">sign up</button>
          </form>
    </div>
}