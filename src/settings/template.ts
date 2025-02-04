import Mustache from 'mustache'
import { SimplifiedItem } from '..'

type FunctionMap = {
  [key: string]: () => (
    text: string,
    render: (text: string) => string
  ) => string
}

export interface Label {
  name: string
  color: string | null
  description: string | null
}

export type HighlightView =
  | {
      text: string
      labels?: Label[]
      highlightUrl: string
      dateHighlighted: string
      rawDateHighlighted: string
      note?: string
      color: string
      positionPercent: number
      positionAnchorIndex: number
    }
  | FunctionMap

export const defaultHighlightTemplate = `> {{{text}}} [⤴️]({{{highlightUrl}}}) {{#labels}} #[[{{{name}}}]] {{/labels}}

{{#note.length}}note:: {{{note}}}{{/note.length}}`


export const defaultArticleTemplate = `[{{{title}}}]({{{originalArticleUrl}}})
{{#showDomainName}}
site:: [{{{domainName}}}]({{{domainName}}})
{{/showDomainName}}
{{#showPublishedBy}}
author:: {{{publishedBy}}}
{{/showPublishedBy}}
{{#showSavedAt}}
saved:: {{savedAtFormatted}}
{{/showSavedAt}}
{{#showPublishedAt}}
published:: {{publishedAtFormatted}}
{{/showPublishedAt}}
{{#showIsArchived}}
is-archived:: {{isArchived}}
{{/showIsArchived}}
{{#showReadingTime}}
reading-time:: {{readingTime}}
{{/showReadingTime}}
id-wallabag:: {{{id}}}`


function lowerCase() {
  return function (text: string, render: (text: string) => string) {
    return render(text).toLowerCase()
  }
}

function upperCase() {
  return function (text: string, render: (text: string) => string) {
    return render(text).toUpperCase()
  }
}

function upperCaseFirst() {
  return function (text: string, render: (text: string) => string) {
    const str = render(text)
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }
}

const functionMap: FunctionMap = {
  lowerCase,
  upperCase,
  upperCaseFirst,
}

export const renderItem = (template: string, item: SimplifiedItem): string => {
  return Mustache.render(template, { ...item, ...functionMap })
}

export const preParseTemplate = (template: string) => {
  Mustache.parse(template)
}
