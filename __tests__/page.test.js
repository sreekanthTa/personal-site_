import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Page from '../app/page'
import userEvent from "@testing-library/user-event";


jest.mock('../actions/redirect', () => ({
    navigateToNotes: jest.fn(),
}))

import { navigateToNotes } from '../actions/redirect'

describe('Home Page testing', ()=>{
    it('render Learning Notes',()=>{
        render(<Page/>)
        const headingElement = screen.getByText(/LEARNING NOTES/i)
        expect(headingElement).toBeInTheDocument()
    })
 
    it('div has onClick handler', async ()=>{

        render(<Page/>)
        const divElement = screen.getByTestId("page-container")
        await userEvent.click(divElement)
        expect(navigateToNotes).toHaveBeenCalled()
    })

})