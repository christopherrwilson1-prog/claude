"""
Student Organization Budget Template Generator
Creates a comprehensive Excel workbook for college student org treasurers
"""

from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from openpyxl.formatting.rule import CellIsRule, FormulaRule
from openpyxl.chart import PieChart, BarChart, LineChart, Reference
from openpyxl.worksheet.datavalidation import DataValidation
from datetime import datetime

class StudentOrgBudgetTemplate:
    def __init__(self):
        self.wb = Workbook()
        self.wb.remove(self.wb.active)  # Remove default sheet

        # Define color scheme (university-friendly blues and grays)
        self.colors = {
            'header': '1F4E78',      # Dark blue
            'subheader': '4472C4',   # Medium blue
            'accent': '5B9BD5',      # Light blue
            'success': '70AD47',     # Green
            'warning': 'FFC000',     # Amber
            'danger': 'C00000',      # Red
            'light_gray': 'D9D9D9',  # Light gray
            'white': 'FFFFFF'
        }

        # Common styles
        self.header_font = Font(name='Calibri', size=14, bold=True, color='FFFFFF')
        self.subheader_font = Font(name='Calibri', size=12, bold=True, color='FFFFFF')
        self.title_font = Font(name='Calibri', size=18, bold=True, color=self.colors['header'])
        self.normal_font = Font(name='Calibri', size=11)
        self.bold_font = Font(name='Calibri', size=11, bold=True)

        self.header_fill = PatternFill(start_color=self.colors['header'],
                                      end_color=self.colors['header'],
                                      fill_type='solid')
        self.subheader_fill = PatternFill(start_color=self.colors['subheader'],
                                         end_color=self.colors['subheader'],
                                         fill_type='solid')
        self.light_fill = PatternFill(start_color=self.colors['light_gray'],
                                     end_color=self.colors['light_gray'],
                                     fill_type='solid')

        self.center_alignment = Alignment(horizontal='center', vertical='center', wrap_text=True)
        self.left_alignment = Alignment(horizontal='left', vertical='center', wrap_text=True)
        self.right_alignment = Alignment(horizontal='right', vertical='center')

        self.thin_border = Border(
            left=Side(style='thin'),
            right=Side(style='thin'),
            top=Side(style='thin'),
            bottom=Side(style='thin')
        )

    def create_template(self):
        """Create all sheets in the workbook"""
        print("Creating Student Organization Budget Template...")

        self.create_instructions_sheet()
        self.create_annual_budget_sheet()
        self.create_semester_breakdown_sheet()
        self.create_event_calculator_sheet()
        self.create_monthly_tracker_sheet()
        self.create_allocation_request_sheet()
        self.create_year_end_report_sheet()
        self.create_dashboard_sheet()
        self.create_example_sheet()

        print("Template created successfully!")

    def create_instructions_sheet(self):
        """Create the Instructions & Overview sheet"""
        ws = self.wb.create_sheet("Instructions")

        # Title
        ws['A1'] = 'STUDENT ORGANIZATION BUDGET TEMPLATE'
        ws['A1'].font = Font(name='Calibri', size=20, bold=True, color=self.colors['header'])
        ws.merge_cells('A1:F1')

        ws['A2'] = 'Your Complete Guide to Financial Planning & Management'
        ws['A2'].font = Font(name='Calibri', size=12, italic=True, color=self.colors['subheader'])
        ws.merge_cells('A2:F2')

        # Welcome section
        row = 4
        ws[f'A{row}'] = 'WELCOME!'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:F{row}')

        row += 1
        welcome_text = """This workbook is designed to help student organization treasurers plan, track, and report on their organization's finances. Whether you're managing a $2,000 budget or $50,000+, this template will help you stay organized and make informed financial decisions."""
        ws[f'A{row}'] = welcome_text
        ws[f'A{row}'].alignment = self.left_alignment
        ws.merge_cells(f'A{row}:F{row+1}')

        # How to use section
        row += 3
        ws[f'A{row}'] = 'HOW TO USE THIS WORKBOOK'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:F{row}')

        instructions = [
            ('1. Start with Annual Budget Planner',
             'Fill in your expected income sources and planned expenses for the year. All formulas will auto-calculate.'),
            ('2. Break Down by Semester',
             'Use the Semester Breakdown sheet to allocate your budget between Fall and Spring.'),
            ('3. Plan Individual Events',
             'Use the Event Budget Calculator for each major event. Track costs and revenue per event.'),
            ('4. Track Monthly Progress',
             'Throughout the year, use Monthly Tracker to compare budgeted vs actual spending.'),
            ('5. Request Funding',
             'Use the Allocation Request sheet to professionally present your budget to student government.'),
            ('6. Year-End Reporting',
             'At year end, use the Year-End Report to summarize your financial performance.'),
            ('7. Monitor Dashboard',
             'Check the Dashboard regularly for visual summaries of your financial health.'),
            ('8. Review Example Sheet',
             'See the Example sheet for a completed budget to guide you.')
        ]

        row += 1
        for step, description in instructions:
            ws[f'A{row}'] = step
            ws[f'A{row}'].font = self.bold_font
            ws[f'B{row}'] = description
            ws[f'B{row}'].alignment = self.left_alignment
            ws.merge_cells(f'B{row}:F{row}')
            row += 1

        # Key definitions
        row += 1
        ws[f'A{row}'] = 'KEY DEFINITIONS'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:F{row}')

        definitions = [
            ('Income', 'Money coming into your organization (allocations, fundraising, dues, etc.)'),
            ('Expenses', 'Money going out of your organization (event costs, supplies, etc.)'),
            ('Fixed Costs', 'Expenses that stay the same (membership fees, subscriptions, etc.)'),
            ('Variable Costs', 'Expenses that change based on activity (event food, printing, etc.)'),
            ('Surplus', 'When income exceeds expenses (you have money left over)'),
            ('Deficit', 'When expenses exceed income (you\'re spending more than you have)'),
            ('Contingency Fund', '10% of budget set aside for unexpected expenses'),
            ('Variance', 'Difference between budgeted and actual amounts'),
            ('Allocation', 'Funding provided by student government'),
            ('Rollover', 'Funds carried over from previous year')
        ]

        row += 1
        for term, definition in definitions:
            ws[f'A{row}'] = term
            ws[f'A{row}'].font = self.bold_font
            ws[f'B{row}'] = definition
            ws[f'B{row}'].alignment = self.left_alignment
            ws.merge_cells(f'B{row}:F{row}')
            row += 1

        # Best practices
        row += 1
        ws[f'A{row}'] = 'BUDGETING BEST PRACTICES'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:F{row}')

        best_practices = [
            'Be realistic with income projections - it\'s better to underestimate than overestimate',
            'Always include a contingency fund (10% of total budget minimum)',
            'Track actual spending monthly - don\'t wait until year end',
            'Keep receipts and documentation for all expenses',
            'Review your budget with your advisor before submitting allocation requests',
            'Plan for seasonal variations (Fall vs Spring spending)',
            'Build in buffer time and money for events (things always cost more than expected)',
            'Communicate with your exec board regularly about financial status',
            'Start budget planning 2-3 months before allocation deadlines',
            'Learn from previous years - review past spending patterns'
        ]

        row += 1
        for i, practice in enumerate(best_practices, 1):
            ws[f'A{row}'] = f'{i}.'
            ws[f'B{row}'] = practice
            ws[f'B{row}'].alignment = self.left_alignment
            ws.merge_cells(f'B{row}:F{row}')
            row += 1

        # Allocation board tips
        row += 1
        ws[f'A{row}'] = 'TIPS FOR PRESENTING TO ALLOCATION BOARDS'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:F{row}')

        presentation_tips = [
            'Know your numbers - be able to explain every line item',
            'Show impact - connect budget requests to student outcomes',
            'Be transparent about challenges and needs',
            'Demonstrate responsible past financial management',
            'Bring supporting documents (event flyers, quotes, receipts)',
            'Practice your presentation beforehand',
            'Dress professionally and arrive early',
            'Be prepared for questions about specific line items',
            'Show how you\'ve tried to reduce costs or find alternative funding',
            'Thank the board for their time and consideration'
        ]

        row += 1
        for i, tip in enumerate(presentation_tips, 1):
            ws[f'A{row}'] = f'{i}.'
            ws[f'B{row}'] = tip
            ws[f'B{row}'].alignment = self.left_alignment
            ws.merge_cells(f'B{row}:F{row}')
            row += 1

        # Color legend
        row += 2
        ws[f'A{row}'] = 'COLOR LEGEND'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:F{row}')

        row += 1
        ws[f'A{row}'] = 'Input cells (white)'
        ws[f'A{row}'].fill = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
        ws[f'A{row}'].border = self.thin_border
        ws[f'B{row}'] = 'These cells are where you enter your data'
        ws.merge_cells(f'B{row}:F{row}')

        row += 1
        ws[f'A{row}'] = 'Calculated cells (gray)'
        ws[f'A{row}'].fill = self.light_fill
        ws[f'A{row}'].border = self.thin_border
        ws[f'B{row}'] = 'These cells contain formulas - do not edit'
        ws.merge_cells(f'B{row}:F{row}')

        row += 1
        ws[f'A{row}'] = 'Over budget (red)'
        ws[f'A{row}'].fill = PatternFill(start_color=self.colors['danger'],
                                         end_color=self.colors['danger'],
                                         fill_type='solid')
        ws[f'A{row}'].border = self.thin_border
        ws[f'B{row}'] = 'Warning: spending exceeds budget'
        ws.merge_cells(f'B{row}:F{row}')

        row += 1
        ws[f'A{row}'] = 'Under budget (green)'
        ws[f'A{row}'].fill = PatternFill(start_color=self.colors['success'],
                                         end_color=self.colors['success'],
                                         fill_type='solid')
        ws[f'A{row}'].border = self.thin_border
        ws[f'B{row}'] = 'Good: spending is within budget'
        ws.merge_cells(f'B{row}:F{row}')

        # Column widths
        ws.column_dimensions['A'].width = 25
        ws.column_dimensions['B'].width = 60
        ws.column_dimensions['C'].width = 15
        ws.column_dimensions['D'].width = 15
        ws.column_dimensions['E'].width = 15
        ws.column_dimensions['F'].width = 15

    def create_annual_budget_sheet(self):
        """Create the Annual Budget Planner sheet"""
        ws = self.wb.create_sheet("Annual Budget")

        # Header
        ws['A1'] = 'ANNUAL BUDGET PLANNER'
        ws['A1'].font = self.title_font
        ws.merge_cells('A1:D1')

        ws['A2'] = f'Academic Year: {datetime.now().year}-{datetime.now().year + 1}'
        ws['A2'].font = Font(name='Calibri', size=12, italic=True)
        ws.merge_cells('A2:D2')

        ws['A3'] = 'Organization Name:'
        ws['A3'].font = self.bold_font
        ws['B3'].fill = PatternFill(start_color='FFFFFF', end_color='FFFFFF', fill_type='solid')
        ws['B3'].border = self.thin_border
        ws.merge_cells('B3:D3')

        # INCOME SECTION
        row = 5
        ws[f'A{row}'] = 'INCOME SOURCES'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws[f'B{row}'].fill = self.header_fill
        ws[f'C{row}'] = 'PROJECTED AMOUNT'
        ws[f'C{row}'].font = self.header_font
        ws[f'C{row}'].fill = self.header_fill
        ws[f'C{row}'].alignment = self.center_alignment
        ws[f'D{row}'] = 'NOTES'
        ws[f'D{row}'].font = self.header_font
        ws[f'D{row}'].fill = self.header_fill
        ws[f'D{row}'].alignment = self.center_alignment
        ws.merge_cells(f'A{row}:B{row}')

        income_categories = [
            ('Student Government Allocation', 'Funding from student government/activities board'),
            ('Fundraising Revenue', 'Money raised through fundraising events, sales, etc.'),
            ('Membership Dues', 'Fees collected from members'),
            ('Event Ticket Sales', 'Revenue from ticketed events'),
            ('Sponsorships', 'Corporate or department sponsorships'),
            ('Donations', 'Individual or alumni donations'),
            ('Grants', 'External grants or awards'),
            ('Rollover from Previous Year', 'Funds carried over from last year'),
            ('Other Income', 'Any other income sources')
        ]

        income_start_row = row + 1
        for category, note in income_categories:
            row += 1
            ws[f'A{row}'] = category
            ws[f'A{row}'].font = self.normal_font
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'] = note
            ws[f'D{row}'].font = Font(name='Calibri', size=9, italic=True, color='666666')
            ws[f'D{row}'].alignment = self.left_alignment

        income_end_row = row

        # Total Income
        row += 1
        ws[f'A{row}'] = 'TOTAL PROJECTED INCOME'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{income_start_row}:C{income_end_row})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        total_income_cell = f'C{row}'

        # EXPENSE SECTION
        row += 3
        ws[f'A{row}'] = 'EXPENSE CATEGORIES'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws[f'B{row}'].fill = self.header_fill
        ws[f'C{row}'] = 'BUDGETED AMOUNT'
        ws[f'C{row}'].font = self.header_font
        ws[f'C{row}'].fill = self.header_fill
        ws[f'C{row}'].alignment = self.center_alignment
        ws[f'D{row}'] = 'NOTES'
        ws[f'D{row}'].font = self.header_font
        ws[f'D{row}'].fill = self.header_fill
        ws[f'D{row}'].alignment = self.center_alignment
        ws.merge_cells(f'A{row}:B{row}')

        expense_categories = [
            ('Events & Programming', 'Costs for events, activities, programs'),
            ('Food & Catering', 'Food for meetings, events, etc.'),
            ('Marketing & Printing', 'Flyers, posters, social media ads'),
            ('Travel & Transportation', 'Conference travel, transportation costs'),
            ('Supplies & Materials', 'Office supplies, event materials'),
            ('Speaker/Performer Fees', 'Payment for speakers, entertainers'),
            ('Equipment & Technology', 'Tech purchases, equipment rental'),
            ('Venue Rental', 'Room rentals, facility fees'),
            ('Merchandise & Apparel', 'T-shirts, promotional items'),
            ('Administrative Costs', 'Insurance, registration fees, bank fees'),
            ('Professional Development', 'Training, workshops for members'),
            ('Other Expenses', 'Any other expense categories')
        ]

        expense_start_row = row + 1
        for category, note in expense_categories:
            row += 1
            ws[f'A{row}'] = category
            ws[f'A{row}'].font = self.normal_font
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'] = note
            ws[f'D{row}'].font = Font(name='Calibri', size=9, italic=True, color='666666')
            ws[f'D{row}'].alignment = self.left_alignment

        expense_end_row = row

        # Contingency Fund
        row += 1
        ws[f'A{row}'] = 'Contingency Fund (10%)'
        ws[f'A{row}'].font = self.normal_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{expense_start_row}:C{expense_end_row})*0.10'
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'D{row}'] = 'Auto-calculated: 10% of total expenses'
        ws[f'D{row}'].font = Font(name='Calibri', size=9, italic=True, color='666666')
        ws[f'D{row}'].alignment = self.left_alignment
        contingency_cell = f'C{row}'

        # Total Expenses
        row += 1
        ws[f'A{row}'] = 'TOTAL BUDGETED EXPENSES'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{expense_start_row}:C{expense_end_row})+{contingency_cell}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        total_expense_cell = f'C{row}'

        # SUMMARY SECTION
        row += 3
        ws[f'A{row}'] = 'BUDGET SUMMARY'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'Total Projected Income'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_income_cell}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Total Budgeted Expenses'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_expense_cell}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'NET POSITION (Surplus/Deficit)'
        ws[f'A{row}'].font = Font(name='Calibri', size=12, bold=True)
        ws[f'A{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_income_cell}-{total_expense_cell}'
        ws[f'C{row}'].font = Font(name='Calibri', size=12, bold=True)
        ws[f'C{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        net_position_cell = f'C{row}'

        row += 1
        ws[f'A{row}'] = 'Budget Status'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=IF({net_position_cell}>=0,"BALANCED ✓","DEFICIT ⚠")'
        ws[f'C{row}'].font = Font(name='Calibri', size=11, bold=True)
        ws[f'C{row}'].alignment = self.center_alignment

        # Conditional formatting for net position
        ws.conditional_formatting.add(net_position_cell,
            CellIsRule(operator='lessThan', formula=['0'],
                      fill=PatternFill(start_color=self.colors['danger'],
                                      end_color=self.colors['danger'],
                                      fill_type='solid'),
                      font=Font(color='FFFFFF', bold=True)))

        ws.conditional_formatting.add(net_position_cell,
            CellIsRule(operator='greaterThanOrEqual', formula=['0'],
                      fill=PatternFill(start_color=self.colors['success'],
                                      end_color=self.colors['success'],
                                      fill_type='solid'),
                      font=Font(color='FFFFFF', bold=True)))

        # Column widths
        ws.column_dimensions['A'].width = 30
        ws.column_dimensions['B'].width = 10
        ws.column_dimensions['C'].width = 20
        ws.column_dimensions['D'].width = 40

    def create_semester_breakdown_sheet(self):
        """Create Semester Breakdown sheet"""
        ws = self.wb.create_sheet("Semester Breakdown")

        # Header
        ws['A1'] = 'SEMESTER BREAKDOWN'
        ws['A1'].font = self.title_font
        ws.merge_cells('A1:E1')

        ws['A2'] = 'Allocate your annual budget between Fall and Spring semesters'
        ws['A2'].font = Font(name='Calibri', size=11, italic=True)
        ws.merge_cells('A2:E2')

        # Headers
        row = 4
        ws[f'A{row}'] = 'CATEGORY'
        ws[f'B{row}'] = 'ANNUAL TOTAL'
        ws[f'C{row}'] = 'FALL SEMESTER'
        ws[f'D{row}'] = 'SPRING SEMESTER'
        ws[f'E{row}'] = 'VARIANCE'

        for col in ['A', 'B', 'C', 'D', 'E']:
            ws[f'{col}{row}'].font = self.header_font
            ws[f'{col}{row}'].fill = self.header_fill
            ws[f'{col}{row}'].alignment = self.center_alignment

        # Income categories
        row += 1
        ws[f'A{row}'] = 'INCOME'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:E{row}')

        income_categories = [
            'Student Government Allocation',
            'Fundraising Revenue',
            'Membership Dues',
            'Event Ticket Sales',
            'Sponsorships',
            'Other Income'
        ]

        income_start = row + 1
        for category in income_categories:
            row += 1
            ws[f'A{row}'] = category
            ws[f'B{row}'].number_format = '$#,##0.00'
            ws[f'B{row}'].border = self.thin_border
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'].number_format = '$#,##0.00'
            ws[f'D{row}'].border = self.thin_border
            ws[f'E{row}'] = f'=B{row}-(C{row}+D{row})'
            ws[f'E{row}'].number_format = '$#,##0.00'
            ws[f'E{row}'].fill = self.light_fill
            ws[f'E{row}'].border = self.thin_border

        income_end = row

        # Total Income
        row += 1
        ws[f'A{row}'] = 'TOTAL INCOME'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws[f'B{row}'] = f'=SUM(B{income_start}:B{income_end})'
        ws[f'B{row}'].font = self.bold_font
        ws[f'B{row}'].fill = self.light_fill
        ws[f'B{row}'].number_format = '$#,##0.00'
        ws[f'B{row}'].border = self.thin_border
        ws[f'C{row}'] = f'=SUM(C{income_start}:C{income_end})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'D{row}'] = f'=SUM(D{income_start}:D{income_end})'
        ws[f'D{row}'].font = self.bold_font
        ws[f'D{row}'].fill = self.light_fill
        ws[f'D{row}'].number_format = '$#,##0.00'
        ws[f'D{row}'].border = self.thin_border
        ws[f'E{row}'] = f'=SUM(E{income_start}:E{income_end})'
        ws[f'E{row}'].font = self.bold_font
        ws[f'E{row}'].fill = self.light_fill
        ws[f'E{row}'].number_format = '$#,##0.00'
        ws[f'E{row}'].border = self.thin_border

        # Expense categories
        row += 2
        ws[f'A{row}'] = 'EXPENSES'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:E{row}')

        expense_categories = [
            'Events & Programming',
            'Food & Catering',
            'Marketing & Printing',
            'Travel & Transportation',
            'Supplies & Materials',
            'Speaker/Performer Fees',
            'Equipment & Technology',
            'Administrative Costs',
            'Contingency Fund'
        ]

        expense_start = row + 1
        for category in expense_categories:
            row += 1
            ws[f'A{row}'] = category
            ws[f'B{row}'].number_format = '$#,##0.00'
            ws[f'B{row}'].border = self.thin_border
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'].number_format = '$#,##0.00'
            ws[f'D{row}'].border = self.thin_border
            ws[f'E{row}'] = f'=B{row}-(C{row}+D{row})'
            ws[f'E{row}'].number_format = '$#,##0.00'
            ws[f'E{row}'].fill = self.light_fill
            ws[f'E{row}'].border = self.thin_border

        expense_end = row

        # Total Expenses
        row += 1
        ws[f'A{row}'] = 'TOTAL EXPENSES'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws[f'B{row}'] = f'=SUM(B{expense_start}:B{expense_end})'
        ws[f'B{row}'].font = self.bold_font
        ws[f'B{row}'].fill = self.light_fill
        ws[f'B{row}'].number_format = '$#,##0.00'
        ws[f'B{row}'].border = self.thin_border
        ws[f'C{row}'] = f'=SUM(C{expense_start}:C{expense_end})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'D{row}'] = f'=SUM(D{expense_start}:D{expense_end})'
        ws[f'D{row}'].font = self.bold_font
        ws[f'D{row}'].fill = self.light_fill
        ws[f'D{row}'].number_format = '$#,##0.00'
        ws[f'D{row}'].border = self.thin_border
        ws[f'E{row}'] = f'=SUM(E{expense_start}:E{expense_end})'
        ws[f'E{row}'].font = self.bold_font
        ws[f'E{row}'].fill = self.light_fill
        ws[f'E{row}'].number_format = '$#,##0.00'
        ws[f'E{row}'].border = self.thin_border

        total_expense_row = row

        # Net Position by semester
        row += 2
        ws[f'A{row}'] = 'NET POSITION'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws[f'C{row}'] = f'=C{total_expense_row - len(expense_categories) - 1}-C{total_expense_row}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'D{row}'] = f'=D{total_expense_row - len(expense_categories) - 1}-D{total_expense_row}'
        ws[f'D{row}'].font = self.bold_font
        ws[f'D{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws[f'D{row}'].number_format = '$#,##0.00'

        # Add note about variance
        row += 2
        ws[f'A{row}'] = 'NOTE: Variance column shows if Fall + Spring allocation matches Annual Total. Should be $0.'
        ws[f'A{row}'].font = Font(name='Calibri', size=10, italic=True, color='666666')
        ws.merge_cells(f'A{row}:E{row}')

        # Conditional formatting for variance
        for r in range(income_start, expense_end + 1):
            ws.conditional_formatting.add(f'E{r}',
                CellIsRule(operator='notEqual', formula=['0'],
                          fill=PatternFill(start_color=self.colors['warning'],
                                          end_color=self.colors['warning'],
                                          fill_type='solid')))

        # Column widths
        ws.column_dimensions['A'].width = 30
        ws.column_dimensions['B'].width = 18
        ws.column_dimensions['C'].width = 18
        ws.column_dimensions['D'].width = 18
        ws.column_dimensions['E'].width = 18

    def create_event_calculator_sheet(self):
        """Create Event Budget Calculator sheet"""
        ws = self.wb.create_sheet("Event Calculator")

        # Header
        ws['A1'] = 'EVENT BUDGET CALCULATOR'
        ws['A1'].font = self.title_font
        ws.merge_cells('A1:D1')

        ws['A2'] = 'Use this template to budget for individual events'
        ws['A2'].font = Font(name='Calibri', size=11, italic=True)
        ws.merge_cells('A2:D2')

        # Event Details
        row = 4
        ws[f'A{row}'] = 'Event Name:'
        ws[f'A{row}'].font = self.bold_font
        ws[f'B{row}'].border = self.thin_border
        ws.merge_cells(f'B{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'Event Date:'
        ws[f'A{row}'].font = self.bold_font
        ws[f'B{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Expected Attendance:'
        ws[f'A{row}'].font = self.bold_font
        ws[f'B{row}'].border = self.thin_border
        ws[f'B{row}'].number_format = '0'
        expected_attendance_cell = f'B{row}'

        # Event Income
        row += 2
        ws[f'A{row}'] = 'EVENT INCOME'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws[f'B{row}'].fill = self.header_fill
        ws[f'C{row}'] = 'AMOUNT'
        ws[f'C{row}'].font = self.header_font
        ws[f'C{row}'].fill = self.header_fill
        ws[f'C{row}'].alignment = self.center_alignment
        ws.merge_cells(f'A{row}:B{row}')

        income_items = [
            'Ticket Sales',
            'Event Sponsorships',
            'Donations',
            'Other Income'
        ]

        income_start = row + 1
        for item in income_items:
            row += 1
            ws[f'A{row}'] = item
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border

        income_end = row

        row += 1
        ws[f'A{row}'] = 'TOTAL EVENT INCOME'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{income_start}:C{income_end})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        total_income_cell = f'C{row}'

        # Event Expenses
        row += 2
        ws[f'A{row}'] = 'EVENT EXPENSES'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws[f'B{row}'].fill = self.header_fill
        ws[f'C{row}'] = 'AMOUNT'
        ws[f'C{row}'].font = self.header_font
        ws[f'C{row}'].fill = self.header_fill
        ws[f'C{row}'].alignment = self.center_alignment
        ws.merge_cells(f'A{row}:B{row}')

        expense_items = [
            'Venue Rental',
            'Food & Catering',
            'Entertainment/Speaker Fees',
            'Decorations',
            'Marketing & Promotion',
            'Supplies & Materials',
            'Equipment Rental',
            'Staff/Security',
            'Contingency (10%)',
            'Other Expenses'
        ]

        expense_start = row + 1
        for item in expense_items:
            row += 1
            ws[f'A{row}'] = item
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border

        expense_end = row

        row += 1
        ws[f'A{row}'] = 'TOTAL EVENT EXPENSES'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{expense_start}:C{expense_end})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        total_expense_cell = f'C{row}'

        # Event Summary
        row += 2
        ws[f'A{row}'] = 'EVENT SUMMARY'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:C{row}')

        row += 1
        ws[f'A{row}'] = 'Total Income'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_income_cell}'
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Total Expenses'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_expense_cell}'
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Net Profit/Loss'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_income_cell}-{total_expense_cell}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Cost Per Attendee'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=IF({expected_attendance_cell}>0,{total_expense_cell}/{expected_attendance_cell},0)'
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'C{row}'].fill = self.light_fill

        row += 1
        ws[f'A{row}'] = 'Break-Even Ticket Price'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=IF({expected_attendance_cell}>0,{total_expense_cell}/{expected_attendance_cell},0)'
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'C{row}'].fill = self.light_fill

        # Column widths
        ws.column_dimensions['A'].width = 30
        ws.column_dimensions['B'].width = 10
        ws.column_dimensions['C'].width = 20
        ws.column_dimensions['D'].width = 30

    def create_monthly_tracker_sheet(self):
        """Create Monthly Tracker sheet"""
        ws = self.wb.create_sheet("Monthly Tracker")

        # Header
        ws['A1'] = 'MONTHLY BUDGET TRACKER'
        ws['A1'].font = self.title_font
        ws.merge_cells('A1:G1')

        ws['A2'] = 'Track budgeted vs actual income and expenses each month'
        ws['A2'].font = Font(name='Calibri', size=11, italic=True)
        ws.merge_cells('A2:G2')

        # Column headers
        row = 4
        headers = ['MONTH', 'BUDGETED INCOME', 'ACTUAL INCOME', 'BUDGETED EXPENSES',
                  'ACTUAL EXPENSES', 'NET POSITION', 'VARIANCE']

        for col_idx, header in enumerate(headers, start=1):
            cell = ws.cell(row=row, column=col_idx)
            cell.value = header
            cell.font = self.header_font
            cell.fill = self.header_fill
            cell.alignment = self.center_alignment

        months = ['August', 'September', 'October', 'November', 'December',
                 'January', 'February', 'March', 'April', 'May']

        month_start_row = row + 1
        for month in months:
            row += 1
            ws[f'A{row}'] = month
            ws[f'A{row}'].font = self.bold_font
            ws[f'B{row}'].number_format = '$#,##0.00'
            ws[f'B{row}'].border = self.thin_border
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'].number_format = '$#,##0.00'
            ws[f'D{row}'].border = self.thin_border
            ws[f'E{row}'].number_format = '$#,##0.00'
            ws[f'E{row}'].border = self.thin_border
            ws[f'F{row}'] = f'=C{row}-E{row}'
            ws[f'F{row}'].number_format = '$#,##0.00'
            ws[f'F{row}'].fill = self.light_fill
            ws[f'F{row}'].border = self.thin_border
            ws[f'G{row}'] = f'=(C{row}-B{row})+(D{row}-E{row})'
            ws[f'G{row}'].number_format = '$#,##0.00'
            ws[f'G{row}'].fill = self.light_fill
            ws[f'G{row}'].border = self.thin_border

            # Conditional formatting for variance
            ws.conditional_formatting.add(f'G{row}',
                CellIsRule(operator='lessThan', formula=['0'],
                          fill=PatternFill(start_color=self.colors['danger'],
                                          end_color=self.colors['danger'],
                                          fill_type='solid')))
            ws.conditional_formatting.add(f'G{row}',
                CellIsRule(operator='greaterThan', formula=['0'],
                          fill=PatternFill(start_color=self.colors['success'],
                                          end_color=self.colors['success'],
                                          fill_type='solid')))

        month_end_row = row

        # Year-to-date totals
        row += 1
        ws[f'A{row}'] = 'YEAR-TO-DATE TOTALS'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws[f'B{row}'] = f'=SUM(B{month_start_row}:B{month_end_row})'
        ws[f'B{row}'].font = self.bold_font
        ws[f'B{row}'].fill = self.light_fill
        ws[f'B{row}'].number_format = '$#,##0.00'
        ws[f'B{row}'].border = self.thin_border
        ws[f'C{row}'] = f'=SUM(C{month_start_row}:C{month_end_row})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'D{row}'] = f'=SUM(D{month_start_row}:D{month_end_row})'
        ws[f'D{row}'].font = self.bold_font
        ws[f'D{row}'].fill = self.light_fill
        ws[f'D{row}'].number_format = '$#,##0.00'
        ws[f'D{row}'].border = self.thin_border
        ws[f'E{row}'] = f'=SUM(E{month_start_row}:E{month_end_row})'
        ws[f'E{row}'].font = self.bold_font
        ws[f'E{row}'].fill = self.light_fill
        ws[f'E{row}'].number_format = '$#,##0.00'
        ws[f'E{row}'].border = self.thin_border
        ws[f'F{row}'] = f'=C{row}-E{row}'
        ws[f'F{row}'].font = self.bold_font
        ws[f'F{row}'].fill = self.light_fill
        ws[f'F{row}'].number_format = '$#,##0.00'
        ws[f'F{row}'].border = self.thin_border
        ws[f'G{row}'] = f'=SUM(G{month_start_row}:G{month_end_row})'
        ws[f'G{row}'].font = self.bold_font
        ws[f'G{row}'].fill = self.light_fill
        ws[f'G{row}'].number_format = '$#,##0.00'
        ws[f'G{row}'].border = self.thin_border

        # Running balance section
        row += 3
        ws[f'A{row}'] = 'RUNNING BALANCE'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:C{row}')

        row += 1
        ws[f'A{row}'] = 'Starting Balance (Rollover):'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        starting_balance_cell = f'C{row}'

        row += 1
        ws[f'A{row}'] = 'YTD Income:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=C{month_end_row + 1}'
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].border = self.thin_border
        ytd_income_cell = f'C{row}'

        row += 1
        ws[f'A{row}'] = 'YTD Expenses:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=E{month_end_row + 1}'
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].border = self.thin_border
        ytd_expenses_cell = f'C{row}'

        row += 1
        ws[f'A{row}'] = 'CURRENT BALANCE:'
        ws[f'A{row}'].font = Font(name='Calibri', size=12, bold=True)
        ws[f'A{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={starting_balance_cell}+{ytd_income_cell}-{ytd_expenses_cell}'
        ws[f'C{row}'].font = Font(name='Calibri', size=12, bold=True)
        ws[f'C{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        # Column widths
        ws.column_dimensions['A'].width = 20
        ws.column_dimensions['B'].width = 18
        ws.column_dimensions['C'].width = 18
        ws.column_dimensions['D'].width = 18
        ws.column_dimensions['E'].width = 18
        ws.column_dimensions['F'].width = 18
        ws.column_dimensions['G'].width = 18

    def create_allocation_request_sheet(self):
        """Create Allocation Request sheet"""
        ws = self.wb.create_sheet("Allocation Request")

        # Header
        ws['A1'] = 'STUDENT GOVERNMENT ALLOCATION REQUEST'
        ws['A1'].font = Font(name='Calibri', size=16, bold=True, color=self.colors['header'])
        ws.merge_cells('A1:D1')

        ws['A2'] = f'Academic Year: {datetime.now().year}-{datetime.now().year + 1}'
        ws['A2'].font = Font(name='Calibri', size=12, italic=True)
        ws.merge_cells('A2:D2')

        # Organization Information
        row = 4
        ws[f'A{row}'] = 'ORGANIZATION INFORMATION'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:D{row}')

        org_fields = [
            'Organization Name:',
            'Mission Statement:',
            'Number of Active Members:',
            'Primary Contact Name:',
            'Contact Email:',
            'Faculty Advisor:'
        ]

        for field in org_fields:
            row += 1
            ws[f'A{row}'] = field
            ws[f'A{row}'].font = self.bold_font
            ws[f'B{row}'].border = self.thin_border
            ws.merge_cells(f'B{row}:D{row}')

        # Requested Allocation
        row += 2
        ws[f'A{row}'] = 'FUNDING REQUEST SUMMARY'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'TOTAL AMOUNT REQUESTED:'
        ws[f'A{row}'].font = Font(name='Calibri', size=12, bold=True)
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'C{row}'].font = Font(name='Calibri', size=12, bold=True)
        ws[f'C{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')

        # Budget Breakdown
        row += 2
        ws[f'A{row}'] = 'DETAILED BUDGET BREAKDOWN'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws[f'B{row}'].fill = self.subheader_fill
        ws[f'C{row}'] = 'REQUESTED AMOUNT'
        ws[f'C{row}'].font = self.subheader_font
        ws[f'C{row}'].fill = self.subheader_fill
        ws[f'C{row}'].alignment = self.center_alignment
        ws[f'D{row}'] = 'JUSTIFICATION'
        ws[f'D{row}'].font = self.subheader_font
        ws[f'D{row}'].fill = self.subheader_fill
        ws[f'D{row}'].alignment = self.center_alignment
        ws.merge_cells(f'A{row}:B{row}')

        categories = [
            'Events & Programming',
            'Food & Catering',
            'Marketing & Printing',
            'Travel & Transportation',
            'Supplies & Materials',
            'Speaker/Performer Fees',
            'Equipment & Technology',
            'Administrative Costs',
            'Contingency Fund'
        ]

        budget_start = row + 1
        for category in categories:
            row += 1
            ws[f'A{row}'] = category
            ws[f'A{row}'].font = self.normal_font
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'].border = self.thin_border
            ws[f'D{row}'].alignment = self.left_alignment

        budget_end = row

        row += 1
        ws[f'A{row}'] = 'TOTAL REQUESTED'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{budget_start}:C{budget_end})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        # Previous Year Summary
        row += 2
        ws[f'A{row}'] = 'PREVIOUS YEAR FINANCIAL SUMMARY'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'Previous Year Allocation:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Amount Spent:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Number of Events Held:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'].border = self.thin_border
        ws[f'C{row}'].number_format = '0'

        row += 1
        ws[f'A{row}'] = 'Total Student Attendance:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'].border = self.thin_border
        ws[f'C{row}'].number_format = '0'

        # Impact Statement
        row += 2
        ws[f'A{row}'] = 'IMPACT & OUTCOMES'
        ws[f'A{row}'].font = self.subheader_font
        ws[f'A{row}'].fill = self.subheader_fill
        ws.merge_cells(f'A{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'Describe the impact this funding will have on the student body:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:D{row}')

        row += 1
        ws.merge_cells(f'A{row}:D{row+3}')
        ws[f'A{row}'].border = self.thin_border
        ws[f'A{row}'].alignment = Alignment(horizontal='left', vertical='top', wrap_text=True)

        row += 4
        ws[f'A{row}'] = 'Key metrics/outcomes you will track:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:D{row}')

        row += 1
        ws.merge_cells(f'A{row}:D{row+2}')
        ws[f'A{row}'].border = self.thin_border
        ws[f'A{row}'].alignment = Alignment(horizontal='left', vertical='top', wrap_text=True)

        # Column widths
        ws.column_dimensions['A'].width = 30
        ws.column_dimensions['B'].width = 10
        ws.column_dimensions['C'].width = 20
        ws.column_dimensions['D'].width = 40

    def create_year_end_report_sheet(self):
        """Create Year-End Report sheet"""
        ws = self.wb.create_sheet("Year-End Report")

        # Header
        ws['A1'] = 'YEAR-END FINANCIAL REPORT'
        ws['A1'].font = self.title_font
        ws.merge_cells('A1:E1')

        ws['A2'] = f'Academic Year: {datetime.now().year}-{datetime.now().year + 1}'
        ws['A2'].font = Font(name='Calibri', size=12, italic=True)
        ws.merge_cells('A2:E2')

        ws['A3'] = 'Organization Name:'
        ws['A3'].font = self.bold_font
        ws['B3'].border = self.thin_border
        ws.merge_cells('B3:E3')

        # Executive Summary
        row = 5
        ws[f'A{row}'] = 'EXECUTIVE SUMMARY'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:E{row}')

        row += 1
        ws[f'A{row}'] = 'METRIC'
        ws[f'B{row}'] = 'BUDGETED'
        ws[f'C{row}'] = 'ACTUAL'
        ws[f'D{row}'] = 'VARIANCE'
        ws[f'E{row}'] = 'VARIANCE %'

        for col in ['A', 'B', 'C', 'D', 'E']:
            ws[f'{col}{row}'].font = self.subheader_font
            ws[f'{col}{row}'].fill = self.subheader_fill
            ws[f'{col}{row}'].alignment = self.center_alignment

        summary_items = [
            'Total Income',
            'Total Expenses',
            'Net Position'
        ]

        for item in summary_items:
            row += 1
            ws[f'A{row}'] = item
            ws[f'A{row}'].font = self.bold_font
            ws[f'B{row}'].number_format = '$#,##0.00'
            ws[f'B{row}'].border = self.thin_border
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'] = f'=C{row}-B{row}'
            ws[f'D{row}'].number_format = '$#,##0.00'
            ws[f'D{row}'].fill = self.light_fill
            ws[f'D{row}'].border = self.thin_border
            ws[f'E{row}'] = f'=IF(B{row}<>0,(C{row}-B{row})/B{row},0)'
            ws[f'E{row}'].number_format = '0.0%'
            ws[f'E{row}'].fill = self.light_fill
            ws[f'E{row}'].border = self.thin_border

            # Conditional formatting
            ws.conditional_formatting.add(f'D{row}',
                CellIsRule(operator='lessThan', formula=['0'],
                          fill=PatternFill(start_color=self.colors['danger'],
                                          end_color=self.colors['danger'],
                                          fill_type='solid')))
            ws.conditional_formatting.add(f'D{row}',
                CellIsRule(operator='greaterThan', formula=['0'],
                          fill=PatternFill(start_color=self.colors['success'],
                                          end_color=self.colors['success'],
                                          fill_type='solid')))

        # Income Breakdown
        row += 2
        ws[f'A{row}'] = 'INCOME BREAKDOWN'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:E{row}')

        row += 1
        ws[f'A{row}'] = 'SOURCE'
        ws[f'B{row}'] = 'BUDGETED'
        ws[f'C{row}'] = 'ACTUAL'
        ws[f'D{row}'] = 'VARIANCE'
        ws[f'E{row}'] = 'VARIANCE %'

        for col in ['A', 'B', 'C', 'D', 'E']:
            ws[f'{col}{row}'].font = self.subheader_font
            ws[f'{col}{row}'].fill = self.subheader_fill
            ws[f'{col}{row}'].alignment = self.center_alignment

        income_sources = [
            'Student Government Allocation',
            'Fundraising Revenue',
            'Membership Dues',
            'Event Ticket Sales',
            'Sponsorships',
            'Other Income'
        ]

        income_start = row + 1
        for source in income_sources:
            row += 1
            ws[f'A{row}'] = source
            ws[f'B{row}'].number_format = '$#,##0.00'
            ws[f'B{row}'].border = self.thin_border
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'] = f'=C{row}-B{row}'
            ws[f'D{row}'].number_format = '$#,##0.00'
            ws[f'D{row}'].fill = self.light_fill
            ws[f'D{row}'].border = self.thin_border
            ws[f'E{row}'] = f'=IF(B{row}<>0,(C{row}-B{row})/B{row},0)'
            ws[f'E{row}'].number_format = '0.0%'
            ws[f'E{row}'].fill = self.light_fill
            ws[f'E{row}'].border = self.thin_border

        income_end = row

        row += 1
        ws[f'A{row}'] = 'TOTAL INCOME'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws[f'B{row}'] = f'=SUM(B{income_start}:B{income_end})'
        ws[f'B{row}'].font = self.bold_font
        ws[f'B{row}'].fill = self.light_fill
        ws[f'B{row}'].number_format = '$#,##0.00'
        ws[f'B{row}'].border = self.thin_border
        ws[f'C{row}'] = f'=SUM(C{income_start}:C{income_end})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'D{row}'] = f'=C{row}-B{row}'
        ws[f'D{row}'].font = self.bold_font
        ws[f'D{row}'].fill = self.light_fill
        ws[f'D{row}'].number_format = '$#,##0.00'
        ws[f'D{row}'].border = self.thin_border
        ws[f'E{row}'] = f'=IF(B{row}<>0,(C{row}-B{row})/B{row},0)'
        ws[f'E{row}'].font = self.bold_font
        ws[f'E{row}'].fill = self.light_fill
        ws[f'E{row}'].number_format = '0.0%'
        ws[f'E{row}'].border = self.thin_border

        # Expense Breakdown
        row += 2
        ws[f'A{row}'] = 'EXPENSE BREAKDOWN'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:E{row}')

        row += 1
        ws[f'A{row}'] = 'CATEGORY'
        ws[f'B{row}'] = 'BUDGETED'
        ws[f'C{row}'] = 'ACTUAL'
        ws[f'D{row}'] = 'VARIANCE'
        ws[f'E{row}'] = 'VARIANCE %'

        for col in ['A', 'B', 'C', 'D', 'E']:
            ws[f'{col}{row}'].font = self.subheader_font
            ws[f'{col}{row}'].fill = self.subheader_fill
            ws[f'{col}{row}'].alignment = self.center_alignment

        expense_categories = [
            'Events & Programming',
            'Food & Catering',
            'Marketing & Printing',
            'Travel & Transportation',
            'Supplies & Materials',
            'Speaker/Performer Fees',
            'Equipment & Technology',
            'Administrative Costs',
            'Contingency Fund'
        ]

        expense_start = row + 1
        for category in expense_categories:
            row += 1
            ws[f'A{row}'] = category
            ws[f'B{row}'].number_format = '$#,##0.00'
            ws[f'B{row}'].border = self.thin_border
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'] = f'=C{row}-B{row}'
            ws[f'D{row}'].number_format = '$#,##0.00'
            ws[f'D{row}'].fill = self.light_fill
            ws[f'D{row}'].border = self.thin_border
            ws[f'E{row}'] = f'=IF(B{row}<>0,(C{row}-B{row})/B{row},0)'
            ws[f'E{row}'].number_format = '0.0%'
            ws[f'E{row}'].fill = self.light_fill
            ws[f'E{row}'].border = self.thin_border

            # Conditional formatting - expenses over budget are bad
            ws.conditional_formatting.add(f'D{row}',
                CellIsRule(operator='greaterThan', formula=['0'],
                          fill=PatternFill(start_color=self.colors['danger'],
                                          end_color=self.colors['danger'],
                                          fill_type='solid')))
            ws.conditional_formatting.add(f'D{row}',
                CellIsRule(operator='lessThan', formula=['0'],
                          fill=PatternFill(start_color=self.colors['success'],
                                          end_color=self.colors['success'],
                                          fill_type='solid')))

        expense_end = row

        row += 1
        ws[f'A{row}'] = 'TOTAL EXPENSES'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws[f'B{row}'] = f'=SUM(B{expense_start}:B{expense_end})'
        ws[f'B{row}'].font = self.bold_font
        ws[f'B{row}'].fill = self.light_fill
        ws[f'B{row}'].number_format = '$#,##0.00'
        ws[f'B{row}'].border = self.thin_border
        ws[f'C{row}'] = f'=SUM(C{expense_start}:C{expense_end})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'D{row}'] = f'=C{row}-B{row}'
        ws[f'D{row}'].font = self.bold_font
        ws[f'D{row}'].fill = self.light_fill
        ws[f'D{row}'].number_format = '$#,##0.00'
        ws[f'D{row}'].border = self.thin_border
        ws[f'E{row}'] = f'=IF(B{row}<>0,(C{row}-B{row})/B{row},0)'
        ws[f'E{row}'].font = self.bold_font
        ws[f'E{row}'].fill = self.light_fill
        ws[f'E{row}'].number_format = '0.0%'
        ws[f'E{row}'].border = self.thin_border

        # Key Achievements
        row += 2
        ws[f'A{row}'] = 'KEY ACHIEVEMENTS & METRICS'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:E{row}')

        metrics = [
            'Total Events Held:',
            'Total Student Attendance:',
            'New Members Recruited:',
            'Funds Raised (External):',
            'Community Service Hours:'
        ]

        for metric in metrics:
            row += 1
            ws[f'A{row}'] = metric
            ws[f'A{row}'].font = self.bold_font
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'].border = self.thin_border

        # Rollover calculation
        row += 2
        ws[f'A{row}'] = 'FUND ROLLOVER'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:E{row}')

        row += 1
        ws[f'A{row}'] = 'Ending Balance:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'C{row}'].fill = PatternFill(start_color=self.colors['accent'],
                                         end_color=self.colors['accent'],
                                         fill_type='solid')
        ws[f'C{row}'].font = self.bold_font

        row += 1
        ws[f'A{row}'] = 'Funds to Rollover to Next Year:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=C{row-1}'
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'C{row}'].fill = self.light_fill

        # Column widths
        ws.column_dimensions['A'].width = 30
        ws.column_dimensions['B'].width = 18
        ws.column_dimensions['C'].width = 18
        ws.column_dimensions['D'].width = 18
        ws.column_dimensions['E'].width = 18

    def create_dashboard_sheet(self):
        """Create Dashboard sheet with visual summary"""
        ws = self.wb.create_sheet("Dashboard", 0)  # Insert as first sheet

        # Header
        ws['A1'] = 'FINANCIAL DASHBOARD'
        ws['A1'].font = Font(name='Calibri', size=20, bold=True, color=self.colors['header'])
        ws.merge_cells('A1:F1')
        ws['A1'].alignment = self.center_alignment

        ws['A2'] = f'Academic Year {datetime.now().year}-{datetime.now().year + 1}'
        ws['A2'].font = Font(name='Calibri', size=12, italic=True)
        ws.merge_cells('A2:F2')
        ws['A2'].alignment = self.center_alignment

        # Key Metrics Section
        row = 4
        ws[f'A{row}'] = 'KEY METRICS'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:F{row}')

        # Metric boxes
        row += 1
        metrics = [
            ('Total Budget', "='Annual Budget'!C32", 'A'),
            ('YTD Income', "='Monthly Tracker'!C15", 'C'),
            ('YTD Expenses', "='Monthly Tracker'!E15", 'E')
        ]

        for metric_name, formula, col in metrics:
            ws[f'{col}{row}'] = metric_name
            ws[f'{col}{row}'].font = Font(name='Calibri', size=11, bold=True)
            ws[f'{col}{row}'].alignment = self.center_alignment
            ws[f'{col}{row}'].fill = self.subheader_fill
            ws.merge_cells(f'{col}{row}:{chr(ord(col)+1)}{row}')

            ws[f'{col}{row+1}'] = formula
            ws[f'{col}{row+1}'].font = Font(name='Calibri', size=18, bold=True, color=self.colors['header'])
            ws[f'{col}{row+1}'].alignment = self.center_alignment
            ws[f'{col}{row+1}'].number_format = '$#,##0'
            ws.merge_cells(f'{col}{row+1}:{chr(ord(col)+1)}{row+1}')

        # Budget Health Status
        row += 3
        ws[f'A{row}'] = 'BUDGET HEALTH'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:F{row}')

        row += 1
        ws[f'A{row}'] = 'Current Status:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = "=IF('Annual Budget'!C34>=0,\"BALANCED ✓\",\"DEFICIT ⚠\")"
        ws[f'C{row}'].font = Font(name='Calibri', size=14, bold=True)
        ws[f'C{row}'].alignment = self.center_alignment
        ws.merge_cells(f'C{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'Available Funds:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = "='Monthly Tracker'!C23"
        ws[f'C{row}'].font = Font(name='Calibri', size=14, bold=True)
        ws[f'C{row}'].alignment = self.center_alignment
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws.merge_cells(f'C{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'Budget Utilization:'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = "=IF('Annual Budget'!C32<>0,'Monthly Tracker'!E15/'Annual Budget'!C32,0)"
        ws[f'C{row}'].font = Font(name='Calibri', size=14, bold=True)
        ws[f'C{row}'].alignment = self.center_alignment
        ws[f'C{row}'].number_format = '0%'
        ws.merge_cells(f'C{row}:D{row}')

        # Quick Stats
        row += 2
        ws[f'A{row}'] = 'QUICK STATS'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:F{row}')

        row += 1
        ws[f'A{row}'] = 'Net Position:'
        ws[f'A{row}'].font = self.bold_font
        ws[f'B{row}'] = "='Annual Budget'!C34"
        ws[f'B{row}'].number_format = '$#,##0.00'
        ws[f'B{row}'].font = self.bold_font

        row += 1
        ws[f'A{row}'] = 'Remaining Budget:'
        ws[f'A{row}'].font = self.bold_font
        ws[f'B{row}'] = "='Annual Budget'!C32-'Monthly Tracker'!E15"
        ws[f'B{row}'].number_format = '$#,##0.00'
        ws[f'B{row}'].font = self.bold_font

        row += 1
        ws[f'A{row}'] = 'Months Remaining:'
        ws[f'A{row}'].font = self.bold_font
        ws[f'B{row}'] = 'Manual Entry'
        ws[f'B{row}'].border = self.thin_border

        # Notes section
        row += 2
        ws[f'A{row}'] = 'NOTES & REMINDERS'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:F{row}')

        row += 1
        notes = [
            '• Update Monthly Tracker regularly with actual income and expenses',
            '• Review Dashboard weekly to monitor budget health',
            '• Green status = on track, Yellow = caution, Red = over budget',
            '• Keep all receipts and documentation for audit purposes',
            '• Communicate with exec board about any significant variances'
        ]

        for note in notes:
            ws[f'A{row}'] = note
            ws[f'A{row}'].alignment = self.left_alignment
            ws.merge_cells(f'A{row}:F{row}')
            row += 1

        # Column widths
        for col in ['A', 'B', 'C', 'D', 'E', 'F']:
            ws.column_dimensions[col].width = 20

    def create_example_sheet(self):
        """Create Example sheet with sample data"""
        ws = self.wb.create_sheet("Example")

        # Header
        ws['A1'] = 'EXAMPLE BUDGET - Computer Science Club'
        ws['A1'].font = self.title_font
        ws.merge_cells('A1:D1')

        ws['A2'] = f'Academic Year: {datetime.now().year}-{datetime.now().year + 1}'
        ws['A2'].font = Font(name='Calibri', size=12, italic=True)
        ws.merge_cells('A2:D2')

        ws['A3'] = 'Organization Name: Computer Science Club'
        ws['A3'].font = self.bold_font
        ws.merge_cells('A3:D3')

        # INCOME SECTION
        row = 5
        ws[f'A{row}'] = 'INCOME SOURCES'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws[f'B{row}'].fill = self.header_fill
        ws[f'C{row}'] = 'PROJECTED AMOUNT'
        ws[f'C{row}'].font = self.header_font
        ws[f'C{row}'].fill = self.header_fill
        ws[f'C{row}'].alignment = self.center_alignment
        ws[f'D{row}'] = 'NOTES'
        ws[f'D{row}'].font = self.header_font
        ws[f'D{row}'].fill = self.header_fill
        ws[f'D{row}'].alignment = self.center_alignment
        ws.merge_cells(f'A{row}:B{row}')

        income_data = [
            ('Student Government Allocation', 8000, 'Main funding source'),
            ('Fundraising Revenue', 2000, 'Hackathon sponsorships'),
            ('Membership Dues', 1500, '50 members x $30'),
            ('Event Ticket Sales', 800, 'Tech talks and workshops'),
            ('Sponsorships', 3000, 'Local tech companies'),
            ('Donations', 500, 'Alumni donations'),
            ('Grants', 0, ''),
            ('Rollover from Previous Year', 1200, 'Ending balance from last year'),
            ('Other Income', 0, '')
        ]

        income_start_row = row + 1
        for category, amount, note in income_data:
            row += 1
            ws[f'A{row}'] = category
            ws[f'A{row}'].font = self.normal_font
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'] = amount
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'] = note
            ws[f'D{row}'].font = Font(name='Calibri', size=9, italic=True, color='666666')
            ws[f'D{row}'].alignment = self.left_alignment

        income_end_row = row

        # Total Income
        row += 1
        ws[f'A{row}'] = 'TOTAL PROJECTED INCOME'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{income_start_row}:C{income_end_row})'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        total_income_cell = f'C{row}'

        # EXPENSE SECTION
        row += 3
        ws[f'A{row}'] = 'EXPENSE CATEGORIES'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws[f'B{row}'].fill = self.header_fill
        ws[f'C{row}'] = 'BUDGETED AMOUNT'
        ws[f'C{row}'].font = self.header_font
        ws[f'C{row}'].fill = self.header_fill
        ws[f'C{row}'].alignment = self.center_alignment
        ws[f'D{row}'] = 'NOTES'
        ws[f'D{row}'].font = self.header_font
        ws[f'D{row}'].fill = self.header_fill
        ws[f'D{row}'].alignment = self.center_alignment
        ws.merge_cells(f'A{row}:B{row}')

        expense_data = [
            ('Events & Programming', 6000, 'Hackathon, tech talks, workshops'),
            ('Food & Catering', 3500, 'Weekly meetings + event catering'),
            ('Marketing & Printing', 800, 'Flyers, banners, social media'),
            ('Travel & Transportation', 2000, 'Conference travel for officers'),
            ('Supplies & Materials', 600, 'Office supplies, swag'),
            ('Speaker/Performer Fees', 1500, 'Guest speakers for tech talks'),
            ('Equipment & Technology', 1200, 'Raspberry Pi kits, software licenses'),
            ('Venue Rental', 0, 'Using campus facilities'),
            ('Merchandise & Apparel', 800, 'Club t-shirts'),
            ('Administrative Costs', 200, 'Bank fees, insurance'),
            ('Professional Development', 400, 'Officer training'),
            ('Other Expenses', 300, 'Miscellaneous')
        ]

        expense_start_row = row + 1
        for category, amount, note in expense_data:
            row += 1
            ws[f'A{row}'] = category
            ws[f'A{row}'].font = self.normal_font
            ws.merge_cells(f'A{row}:B{row}')
            ws[f'C{row}'] = amount
            ws[f'C{row}'].number_format = '$#,##0.00'
            ws[f'C{row}'].border = self.thin_border
            ws[f'D{row}'] = note
            ws[f'D{row}'].font = Font(name='Calibri', size=9, italic=True, color='666666')
            ws[f'D{row}'].alignment = self.left_alignment

        expense_end_row = row

        # Contingency Fund
        row += 1
        ws[f'A{row}'] = 'Contingency Fund (10%)'
        ws[f'A{row}'].font = self.normal_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{expense_start_row}:C{expense_end_row})*0.10'
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        ws[f'D{row}'] = 'Auto-calculated: 10% of total expenses'
        ws[f'D{row}'].font = Font(name='Calibri', size=9, italic=True, color='666666')
        ws[f'D{row}'].alignment = self.left_alignment
        contingency_cell = f'C{row}'

        # Total Expenses
        row += 1
        ws[f'A{row}'] = 'TOTAL BUDGETED EXPENSES'
        ws[f'A{row}'].font = self.bold_font
        ws[f'A{row}'].fill = self.light_fill
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'=SUM(C{expense_start_row}:C{expense_end_row})+{contingency_cell}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].fill = self.light_fill
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border
        total_expense_cell = f'C{row}'

        # SUMMARY SECTION
        row += 3
        ws[f'A{row}'] = 'BUDGET SUMMARY'
        ws[f'A{row}'].font = self.header_font
        ws[f'A{row}'].fill = self.header_fill
        ws.merge_cells(f'A{row}:D{row}')

        row += 1
        ws[f'A{row}'] = 'Total Projected Income'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_income_cell}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Total Budgeted Expenses'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_expense_cell}'
        ws[f'C{row}'].font = self.bold_font
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'NET POSITION (Surplus/Deficit)'
        ws[f'A{row}'].font = Font(name='Calibri', size=12, bold=True)
        ws[f'A{row}'].fill = PatternFill(start_color=self.colors['success'],
                                         end_color=self.colors['success'],
                                         fill_type='solid')
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = f'={total_income_cell}-{total_expense_cell}'
        ws[f'C{row}'].font = Font(name='Calibri', size=12, bold=True, color='FFFFFF')
        ws[f'C{row}'].fill = PatternFill(start_color=self.colors['success'],
                                         end_color=self.colors['success'],
                                         fill_type='solid')
        ws[f'C{row}'].number_format = '$#,##0.00'
        ws[f'C{row}'].border = self.thin_border

        row += 1
        ws[f'A{row}'] = 'Budget Status'
        ws[f'A{row}'].font = self.bold_font
        ws.merge_cells(f'A{row}:B{row}')
        ws[f'C{row}'] = 'BALANCED ✓'
        ws[f'C{row}'].font = Font(name='Calibri', size=11, bold=True, color=self.colors['success'])
        ws[f'C{row}'].alignment = self.center_alignment

        # Column widths
        ws.column_dimensions['A'].width = 30
        ws.column_dimensions['B'].width = 10
        ws.column_dimensions['C'].width = 20
        ws.column_dimensions['D'].width = 40

    def save(self, filename):
        """Save the workbook"""
        self.wb.save(filename)
        print(f"Workbook saved as: {filename}")

def main():
    """Main function to generate the template"""
    print("=" * 60)
    print("STUDENT ORGANIZATION BUDGET TEMPLATE GENERATOR")
    print("=" * 60)
    print()

    template = StudentOrgBudgetTemplate()
    template.create_template()

    # Save main template
    main_filename = 'Student_Org_Budget_Template.xlsx'
    template.save(main_filename)

    print()
    print("=" * 60)
    print("TEMPLATE GENERATION COMPLETE!")
    print("=" * 60)
    print(f"\nGenerated file: {main_filename}")
    print("\nThe workbook includes:")
    print("  ✓ Dashboard (visual summary)")
    print("  ✓ Instructions & Overview")
    print("  ✓ Annual Budget Planner")
    print("  ✓ Semester Breakdown")
    print("  ✓ Event Budget Calculator")
    print("  ✓ Monthly Tracker")
    print("  ✓ Allocation Request")
    print("  ✓ Year-End Report")
    print("  ✓ Example with sample data")
    print("\nReady to use by student organization treasurers!")

if __name__ == "__main__":
    main()
