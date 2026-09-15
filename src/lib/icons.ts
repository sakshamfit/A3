/**
 * Iconify icon registry.
 *
 * Every icon used on the site is bundled locally (from the `@iconify-icons/solar`
 * icon-data package) and registered before render, so
 * `<iconify-icon icon="solar:..." />` resolves instantly with no runtime
 * round-trip to the Iconify API.
 */
import { addIcon } from 'iconify-icon'

import altArrowDownLinear from '@iconify-icons/solar/alt-arrow-down-linear'
import altArrowUpLinear from '@iconify-icons/solar/alt-arrow-up-linear'
import arrowLeftLinear from '@iconify-icons/solar/arrow-left-linear'
import arrowRightLinear from '@iconify-icons/solar/arrow-right-linear'
import bedLinear from '@iconify-icons/solar/bed-linear'
import chatRoundLinear from '@iconify-icons/solar/chat-round-linear'
import cityLinear from '@iconify-icons/solar/city-linear'
import clockCircleLinear from '@iconify-icons/solar/clock-circle-linear'
import closeCircleLinear from '@iconify-icons/solar/close-circle-linear'
import codeCircleLinear from '@iconify-icons/solar/code-circle-linear'
import cursorLinear from '@iconify-icons/solar/cursor-linear'
import cupStarLinear from '@iconify-icons/solar/cup-star-linear'
import galleryLinear from '@iconify-icons/solar/gallery-linear'
import globalLinear from '@iconify-icons/solar/global-linear'
import hamburgerMenuLinear from '@iconify-icons/solar/hamburger-menu-linear'
import hashtagCircleLinear from '@iconify-icons/solar/hashtag-circle-linear'
import leafLinear from '@iconify-icons/solar/leaf-linear'
import layersMinimalisticLinear from '@iconify-icons/solar/layers-minimalistic-linear'
import letterLinear from '@iconify-icons/solar/letter-linear'
import linkCircleLinear from '@iconify-icons/solar/link-circle-linear'
import lockKeyholeLinear from '@iconify-icons/solar/lock-keyhole-linear'
import mapPointLinear from '@iconify-icons/solar/map-point-linear'
import maximizeSquareLinear from '@iconify-icons/solar/maximize-square-linear'
import medalRibbonLinear from '@iconify-icons/solar/medal-ribbon-linear'
import phoneCallingLinear from '@iconify-icons/solar/phone-calling-linear'
import plainLinear from '@iconify-icons/solar/plain-2-linear'
import shieldCheckLinear from '@iconify-icons/solar/shield-check-linear'
import starBold from '@iconify-icons/solar/star-bold'
import tagPriceLinear from '@iconify-icons/solar/tag-price-linear'
import usersGroupRoundedLinear from '@iconify-icons/solar/users-group-rounded-linear'

const REGISTRY = {
  'solar:alt-arrow-down-linear': altArrowDownLinear,
  'solar:alt-arrow-up-linear': altArrowUpLinear,
  'solar:arrow-left-linear': arrowLeftLinear,
  'solar:arrow-right-linear': arrowRightLinear,
  'solar:bed-linear': bedLinear,
  'solar:chat-round-linear': chatRoundLinear,
  'solar:city-linear': cityLinear,
  'solar:clock-circle-linear': clockCircleLinear,
  'solar:close-circle-linear': closeCircleLinear,
  'solar:code-circle-linear': codeCircleLinear,
  'solar:cursor-linear': cursorLinear,
  'solar:cup-star-linear': cupStarLinear,
  'solar:gallery-linear': galleryLinear,
  'solar:global-linear': globalLinear,
  'solar:hamburger-menu-linear': hamburgerMenuLinear,
  'solar:hashtag-circle-linear': hashtagCircleLinear,
  'solar:leaf-linear': leafLinear,
  'solar:layers-minimalistic-linear': layersMinimalisticLinear,
  'solar:letter-linear': letterLinear,
  'solar:link-circle-linear': linkCircleLinear,
  'solar:lock-keyhole-linear': lockKeyholeLinear,
  'solar:map-point-linear': mapPointLinear,
  'solar:maximize-square-linear': maximizeSquareLinear,
  'solar:medal-ribbon-linear': medalRibbonLinear,
  'solar:phone-calling-linear': phoneCallingLinear,
  'solar:plain-linear': plainLinear,
  'solar:plain-2-linear': plainLinear,
  'solar:shield-check-linear': shieldCheckLinear,
  'solar:star-bold': starBold,
  'solar:tag-price-linear': tagPriceLinear,
  'solar:users-group-rounded-linear': usersGroupRoundedLinear,
} as const

export type IconName = keyof typeof REGISTRY

export function registerIcons() {
  for (const [name, data] of Object.entries(REGISTRY)) {
    addIcon(name, data)
  }
}
