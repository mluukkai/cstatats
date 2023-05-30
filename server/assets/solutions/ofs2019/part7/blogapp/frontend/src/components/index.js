import styled from 'styled-components'

export const Button = styled.button`
  background: Bisque;
  font-size: 1em;
  margin-top: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`

export const NavButton = styled.button`
  background: Bisque;
  font-size: 1em;
  border: 1px solid Chocolate;
  border-radius: 3px;
`

export const Input = styled.input`
  margin: 0.25em;
`

export const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`

export const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

export const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 2em;
`

export const Info = styled.div`
  color: ${(props) => (props.alert ? 'red' : 'green')};
  background: white;
  font-size: 20px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  margin-top: 10px;
`
