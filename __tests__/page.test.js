import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'


describe('Home Page testing', ()=>{
    it('render Learning Notes',()=>{
        render(<Page/>)
        const headingElement = screen.getByText(/LEARNING NOTES/i)
        expect(headingElement).toBeInTheDocument()
                               
    })
})